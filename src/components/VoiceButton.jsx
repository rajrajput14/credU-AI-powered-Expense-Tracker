import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic } from 'lucide-react'
import clsx from 'clsx'
import { parseTransactionIntent } from '../services/gemini'
import { useAppStore } from '../store/useAppStore'
import { supabase } from '../services/supabase'
import { playSuccessSound, playErrorSound, playListeningStart } from '../services/audioService'
import { useNavigate } from 'react-router-dom'
import VoiceOverlay from './VoiceOverlay'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

const VoiceButton = () => {
    const navigate = useNavigate()
    const { addTransaction, updateTransaction, deleteTransaction, setVoiceEntry, voiceTrigger, isVoiceLimitReached, setPaywallOpen, incrementVoiceUsage, transactions } = useAppStore()
    
    // UI States: IDLE, LISTENING, PROCESSING, CONFIRMATION, ERROR
    const [uiState, setUiState] = useState('IDLE')

    useEffect(() => {
        if (voiceTrigger > 0 && uiState === 'IDLE') {
            startVoice()
        }
    }, [voiceTrigger])
    const [transcript, setTranscript] = useState("")
    const [result, setResult] = useState(null)
    const [lastResult, setLastResult] = useState(null)
    const [error, setError] = useState(null)
    
    const recognitionRef = useRef(null)
    const transcriptRef = useRef("")
    const silenceTimerRef = useRef(null)

    useEffect(() => {
        // Initialize Speech Recognition once
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            const recognition = new SpeechRecognition()
            
            recognition.continuous = true
            recognition.interimResults = true
            recognition.lang = 'en-IN' // Optimized for Indian accents and Hinglish
            
            recognition.onstart = async () => {
                console.log("Recognition started")
                await Haptics.impact({ style: ImpactStyle.Heavy })
            }
            
            recognition.onresult = (event) => {
                let current = ""
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    current += event.results[i][0].transcript
                }
                setTranscript(current)
                transcriptRef.current = current

                // Reset silence timer whenever we get a result
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
                silenceTimerRef.current = setTimeout(() => {
                    if (transcriptRef.current) {
                        recognition.stop()
                    }
                }, 1800) // 1.8 seconds of silence for natural pauses
            }

            recognition.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error)
                if (event.error === 'not-allowed') {
                    handleError("Microphone access denied. Please enable it in settings.")
                } else if (event.error === 'network') {
                    handleError("Network connection error. Try again.")
                } else if (event.error === 'no-speech') {
                    setUiState('IDLE')
                } else {
                    handleError(`Voice error: ${event.error}`)
                }
            }

            recognition.onend = () => {
                console.log("Speech ended (Auto-Stop).")
                if (transcriptRef.current) {
                    processVoice(transcriptRef.current)
                    Haptics.notification({ type: NotificationType.Success })
                } else {
                    setUiState(prev => prev === 'LISTENING' ? 'IDLE' : prev)
                }
            }

            recognitionRef.current = recognition
        } else {
            console.warn("Speech Recognition not supported in this browser.")
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
                recognitionRef.current = null
            }
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
        }
    }, [])

    const startVoice = async () => {
        if (!recognitionRef.current) {
            handleError("Speech recognition is not supported in this browser.")
            return
        }

        if (isVoiceLimitReached()) {
            setPaywallOpen(true)
            return
        }
        
        playListeningStart()
        setTranscript("")
        transcriptRef.current = ""
        setError(null)
        setResult(null)
        setUiState('LISTENING')
        
        try {
            await Haptics.impact({ style: ImpactStyle.Medium })
            recognitionRef.current.start()
        } catch (e) {
            console.warn("Recognition already started or error:", e)
        }
    }

    const stopVoice = async () => {
        if (recognitionRef.current) {
            await Haptics.impact({ style: ImpactStyle.Medium })
            recognitionRef.current.stop()
        }
    }

    const speakResponse = (text) => {
        if (!window.speechSynthesis) return
        window.speechSynthesis.cancel() 
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 1.1
        utterance.pitch = 1.0
        window.speechSynthesis.speak(utterance)
    }

    const normalizeText = (text) => {
        // Step 2: Basic client-side clean (Fillers are better handled by Gemini but we can trim)
        return text.trim();
    }

    const processVoice = async (rawText) => {
        const text = normalizeText(rawText)
        if (!text) return
        
        setUiState('PROCESSING')
        try {
            const history = transactions.slice(0, 15).map(t => 
                `${t.name || t.category}${t.category ? ` (${t.category})` : ''}`
            ).join(', ')
            
            const response = await parseTransactionIntent(text, history, lastResult)
            console.log("WhisperFlow Output:", response)

            if (response && response.transactions?.length > 0) {
                // Step 5: Confidence Score threshold check
                if (response.confidence < 0.3) {
                    handleError("I'm not exactly sure what you meant. Could you try again?")
                    return;
                }

                setResult(response)
                setLastResult(response.transactions[0])
                setUiState('CONFIRMATION')
                
                if (response.voiceResponse) {
                    speakResponse(response.voiceResponse)
                }
            } else {
                handleError("I couldn't detect any transaction details. Try saying 'Spent 200 on Coffee'.")
            }
        } catch (err) {
            console.error(err)
            handleError(err.message || "I had trouble processing that request.")
        }
    }

    const handleError = (msg) => {
        setError(msg)
        setUiState('ERROR')
        playErrorSound()
    }

    const handleConfirm = async () => {
        if (!result || !result.transactions) return
        setUiState('PROCESSING')
        
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No user found")
            
            await Haptics.impact({ style: ImpactStyle.Medium })
            for (const tx of result.transactions) {
                if (tx.action === 'create' || tx.action === 'update') {
                    // For now, even "update" corrections from voice are treated as new entries
                    // because we are in a voice-modal flow. In v3 we can map to specific IDs.
                    await addTransaction(user.id, {
                        amount: tx.amount,
                        type: tx.type,
                        category: tx.category,
                        name: tx.merchant || tx.category || "Voice Entry",
                        note: tx.summary || "Added via voice",
                        date: tx.date || new Date().toISOString()
                    })
                } else if (tx.action === 'delete') {
                    // Logic for deleting specific items could go here if transactionId is known
                }
            }

            await Haptics.notification({ type: NotificationType.Success })
            playSuccessSound()
            incrementVoiceUsage()
            setUiState('IDLE')
            setResult(null)
            setTranscript("")
        } catch (err) {
            console.error(err)
            handleError("I couldn't save that. Please try again.")
        }
    }

    const handleEdit = () => {
        if (!result || !result.transactions?.[0]) return

        const tx = result.transactions[0]
        
        // Save the current result to the store
        setVoiceEntry({
            amount: tx.amount,
            type: tx.type,
            category: tx.category,
            name: tx.summary || tx.merchant || "Voice Entry"
        })
        // Navigate to transactions page
        navigate('/app-dashboard/transactions')
        // Close overlay
        setUiState('IDLE')
    }

    const handleRetry = () => {
        startVoice()
    }

    const handleCancel = () => {
        recognitionRef.current?.stop()
        setUiState('IDLE')
        setTranscript("")
        setResult(null)
    }

    return (
        <>
            <AnimatePresence>
                {uiState !== 'IDLE' && (
                    <VoiceOverlay 
                        state={uiState}
                        transcript={transcript}
                        result={result}
                        error={error}
                        onConfirm={handleConfirm}
                        onEdit={handleEdit}
                        onRetry={() => {
                            setUiState('LISTENING')
                            startVoice()
                        }}
                        onCancel={() => {
                            recognitionRef.current?.stop()
                            setUiState('IDLE')
                        }}
                    />
                )}
            </AnimatePresence>

            <div className="fixed bottom-24 right-6 z-40 md:bottom-28 lg:bottom-10 lg:right-10 group">
                <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-primary text-surface text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md pointer-events-none shadow-xl border border-white/10">
                    Voice Assistant
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startVoice}
                    disabled={uiState !== 'IDLE'}
                    className={clsx(
                        "relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-500",
                        uiState === 'IDLE' 
                            ? "bg-gradient-to-br from-primary to-secondary text-surface shadow-primary/40 border border-white/10" 
                            : "bg-surface-container-lowest text-primary scale-125 border border-primary/20"
                    )}
                >
                    {/* Pulsing ring for IDLE state */}
                    {uiState === 'IDLE' && (
                        <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full bg-primary"
                        />
                    )}
                    
                    <Mic className="relative z-10" size={28} />
                    
                    {/* Status Dot */}
                    {uiState === 'LISTENING' && (
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error border-2 border-surface-container-lowest"
                        />
                    )}
                </motion.button>
            </div>
        </>
    )
}

export default VoiceButton
