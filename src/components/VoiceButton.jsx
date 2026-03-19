import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic } from 'lucide-react'
import clsx from 'clsx'
import { parseTransactionIntent } from '../services/gemini'
import { useTransactionStore } from '../store/useTransactionStore'
import { supabase } from '../services/supabase'
import { playSuccessSound, playErrorSound, playListeningStart } from '../services/audioService'
import { useNavigate } from 'react-router-dom'
import VoiceOverlay from './VoiceOverlay'

const VoiceButton = () => {
    const navigate = useNavigate()
    const { addTransaction, deleteTransaction, updateTransaction, setVoiceEntry } = useTransactionStore()
    
    // UI States: IDLE, LISTENING, PROCESSING, CONFIRMATION, ERROR
    const [uiState, setUiState] = useState('IDLE')
    const [transcript, setTranscript] = useState("")
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    
    const recognitionRef = useRef(null)
    const transcriptRef = useRef("")

    useEffect(() => {
        // Initialize Speech Recognition once
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            const recognition = new SpeechRecognition()
            
            recognition.continuous = false 
            recognition.interimResults = true
            recognition.lang = 'en-US'
            
            recognition.onresult = (event) => {
                let current = ""
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    current += event.results[i][0].transcript
                }
                setTranscript(current)
                transcriptRef.current = current
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
                handleError("I couldn't quite understand that command. Try saying 'spent 50 for pizza'.")
            }
        } catch (err) {
            console.error(err)
            handleError("Something went wrong with the AI processing.")
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
            setUiState('IDLE')
            setResult(null)
            setTranscript("")
        } catch (err) {
            console.error(err)
            handleError("Failed to save transaction.")
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

            <div className="fixed bottom-6 right-6 z-40 lg:bottom-10 lg:right-10">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startVoice}
                    disabled={uiState !== 'IDLE'}
                    className={clsx(
                        "relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-500",
                        uiState === 'IDLE' 
                            ? "bg-gradient-to-br from-voxa-primary to-voxa-secondary text-white shadow-indigo-500/40" 
                            : "bg-voxa-card text-voxa-primary scale-125"
                    )}
                >
                    {/* Pulsing ring for IDLE state */}
                    {uiState === 'IDLE' && (
                        <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full bg-voxa-primary"
                        />
                    )}
                    
                    <Mic className="relative z-10" size={28} />
                    
                    {/* Status Dot */}
                    {uiState === 'LISTENING' && (
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 border-2 border-voxa-card"
                        />
                    )}
                </motion.button>
            </div>
        </>
    )
}

export default VoiceButton
