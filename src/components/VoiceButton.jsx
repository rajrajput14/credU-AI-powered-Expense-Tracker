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

const VoiceButton = () => {
    const navigate = useNavigate()
    const { addTransaction, updateTransaction, deleteTransaction, setVoiceEntry, voiceTrigger, isVoiceLimitReached, setPaywallOpen, incrementVoiceUsage } = useAppStore()
    
    // UI States: IDLE, LISTENING, PROCESSING, CONFIRMATION, ERROR
    const [uiState, setUiState] = useState('IDLE')

    useEffect(() => {
        if (voiceTrigger > 0 && uiState === 'IDLE') {
            startVoice()
        }
    }, [voiceTrigger])
    const [transcript, setTranscript] = useState("")
    const [result, setResult] = useState(null)
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
            recognition.lang = 'en-US'
            
            recognition.onstart = () => {
                console.log("Recognition started")
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
                }, 2000) // 2 seconds of silence to trigger processing
            }

            recognition.onend = () => {
                console.log("Speech ended (Auto-Stop).")
                if (transcriptRef.current) {
                    processVoice(transcriptRef.current)
                } else {
                    // Only go to idle if we were actually listening and didn't start processing
                    setUiState(prev => prev === 'LISTENING' ? 'IDLE' : prev)
                }
            }

            recognitionRef.current = recognition
        }
    }, [])

    const startVoice = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition not supported in this browser.")
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
            recognitionRef.current.start()
        } catch (e) {
            console.warn("Recognition already started or error:", e)
        }
    }

    const stopVoice = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            // onend will handle the transition
        }
    }

    const processVoice = async (text) => {
        setUiState('PROCESSING')
        try {
            const parsed = await parseTransactionIntent(text)
            console.log("Gemini Output:", parsed)

            if (parsed && parsed.action) {
                setResult(parsed)
                setUiState('CONFIRMATION')
            } else {
                handleError("I didn't quite catch that. Try saying something like 'spent 50 on pizza'.")
            }
        } catch (err) {
            console.error(err)
            handleError("Something went wrong. Please try again.")
        }
    }

    const handleError = (msg) => {
        setError(msg)
        setUiState('ERROR')
        playErrorSound()
    }

    const handleConfirm = async () => {
        setUiState('PROCESSING')
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No user found")
            
            if (result.action === 'create') {
                await addTransaction(user.id, {
                    amount: result.amount,
                    type: result.type,
                    category: result.category,
                    note: result.note,
                    date: new Date().toISOString()
                })
            } else if (result.action === 'delete') {
                await deleteTransaction(result.transactionId)
            } else if (result.action === 'update') {
                await updateTransaction(result.transactionId, {
                    amount: result.amount,
                    category: result.category,
                    note: result.note
                })
            }

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
        // Save the current result to the store
        setVoiceEntry({
            amount: result.amount,
            type: result.type,
            category: result.category,
            note: result.note
        })
        // Navigate to transactions page
        navigate('/transactions')
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
