import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, XCircle, Mic } from 'lucide-react'
import clsx from 'clsx'

const VoiceOverlay = ({ 
    state, 
    transcript, 
    result, 
    error,
    onConfirm,
    onEdit,
    onRetry,
    onCancel
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-voxa-bg/60 backdrop-blur-3xl transition-colors duration-200"
        >
            <div className="relative w-full max-w-2xl px-6">
                {/* Close Button */}
                <button 
                    onClick={onCancel}
                    className="absolute -top-16 right-6 p-3 rounded-full bg-voxa-card/50 text-voxa-muted hover:text-voxa-text transition-all"
                >
                    <X size={24} />
                </button>

                <div className="space-y-12 text-center">
                    {/* Visual State indicator */}
                    <div className="flex justify-center">
                        {state === 'LISTENING' && (
                            <div className="flex items-end gap-1 h-16">
                                {[1,2,3,4,5,6,7,8].map(i => (
                                    <motion.div 
                                        key={i}
                                        animate={{ height: [20, 60, 20] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                        className="w-1.5 rounded-full bg-voxa-primary opacity-60"
                                    />
                                ))}
                            </div>
                        )}
                        {state === 'PROCESSING' && (
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="h-16 w-16 rounded-full border-4 border-voxa-primary border-t-transparent"
                            />
                        )}
                        {(state === 'CONFIRMATION' || state === 'ERROR') && (
                            <div className={clsx(
                                "h-20 w-20 rounded-full flex items-center justify-center text-white",
                                state === 'ERROR' ? "bg-rose-500 shadow-lg shadow-rose-500/30" : "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                            )}>
                                {state === 'ERROR' ? <XCircle size={40} /> : <Check size={40} />}
                            </div>
                        )}
                    </div>

                    {/* Text content */}
                    <div className="space-y-4">
                        <h2 className={clsx(
                            "text-3xl font-bold tracking-tight",
                            state === 'ERROR' ? "text-rose-400" : "text-voxa-text"
                        )}>
                            {state === 'LISTENING' && "Listening..."}
                            {state === 'PROCESSING' && "Analyzing..."}
                            {state === 'CONFIRMATION' && "Ready to confirm"}
                            {state === 'ERROR' && "Something went wrong"}
                        </h2>
                        
                        <div className="mx-auto max-w-md">
                            {state === 'LISTENING' && (
                                <p className="text-xl text-voxa-muted font-medium italic leading-relaxed">
                                    {transcript || '"Try saying: Spent 500 on dinner"'}
                                </p>
                            )}
                            {state === 'CONFIRMATION' && result && (
                                <div className="rounded-3xl bg-voxa-card border border-voxa-border p-8 shadow-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-voxa-muted">Proposed Entry</span>
                                        <span className={clsx(
                                            "rounded-full px-3 py-1 text-[10px] font-bold uppercase",
                                            result.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                        )}>
                                            {result.type}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-4xl font-black text-voxa-text leading-none">₹{result.amount}</p>
                                        <p className="text-lg font-bold text-voxa-muted">{result.category} • {result.note}</p>
                                    </div>
                                </div>
                            )}
                            {state === 'ERROR' && (
                                <p className="text-lg text-rose-400 bg-rose-500/10 py-3 px-6 rounded-2xl border border-rose-500/20 inline-block font-medium">
                                    {error || "I couldn't understand that command."}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <AnimatePresence>
                        {state === 'CONFIRMATION' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col gap-4 w-full"
                            >
                                <div className="flex gap-4 w-full">
                                    <button 
                                        onClick={onCancel}
                                        className="flex-1 rounded-2xl bg-voxa-card border border-voxa-border py-4 font-bold text-voxa-muted hover:bg-voxa-bg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={onEdit}
                                        className="flex-1 rounded-2xl border border-voxa-primary/50 bg-voxa-primary/10 py-4 font-bold text-voxa-primary hover:bg-voxa-primary/20 transition-all"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={onConfirm}
                                        className="flex-[2] rounded-2xl bg-gradient-to-r from-voxa-primary to-voxa-secondary py-4 font-bold text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
                                    >
                                        Confirm & Save
                                    </button>
                                </div>
                            </motion.div>
                        )}
                        {state === 'ERROR' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4 justify-center"
                            >
                                <button 
                                    onClick={onRetry}
                                    className="rounded-2xl bg-voxa-text px-10 py-4 font-bold text-voxa-bg hover:opacity-90 transition-all active:scale-95"
                                >
                                    Try Again
                                </button>
                                <button 
                                    onClick={onCancel}
                                    className="rounded-2xl border border-voxa-border bg-voxa-card px-10 py-4 font-bold text-voxa-muted hover:text-voxa-text transition-all"
                                >
                                    Cancel
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {state === 'LISTENING' && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        className="mt-12 text-center text-xs text-voxa-muted tracking-widest uppercase"
                    >
                        Speak naturally to Voxa
                    </motion.p>
                )}
            </div>
        </motion.div>
    )
}

export default VoiceOverlay
