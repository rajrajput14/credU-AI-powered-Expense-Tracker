import { motion, AnimatePresence } from 'framer-motion'
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
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-on-surface/95 backdrop-blur-2xl transition-colors duration-200"
        >
            <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 w-full h-full">
                {/* Close Button */}
                <button 
                    onClick={onCancel}
                    className="absolute top-6 right-6 w-12 h-12 bg-surface-container/10 hover:bg-surface-container/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-sm border border-outline-variant/10"
                >
                    <span className="material-symbols-outlined text-surface">close</span>
                </button>

                <div className="text-center max-w-lg mx-auto w-full font-body">
                    <p className="text-primary font-black mb-4 uppercase tracking-[0.3em] text-[10px] italic">credU Voice</p>
                    
                    <h1 className={clsx(
                        "text-3xl md:text-5xl font-black tracking-tighter mb-12 font-headline uppercase",
                        state === 'ERROR' ? "text-error" : "text-surface"
                    )}>
                        {state === 'LISTENING' && "I'm listening..."}
                        {state === 'PROCESSING' && "One second..."}
                        {state === 'CONFIRMATION' && "Is this right?"}
                        {state === 'ERROR' && "I didn't catch that"}
                    </h1>
                    
                    {/* Visual State Indicator */}
                    <div className="relative w-48 h-48 mx-auto mb-16 flex items-center justify-center">
                        {state === 'LISTENING' && (
                            <>
                                <div className="absolute inset-0 bg-primary rounded-full blur-[80px] opacity-30 animate-pulse"></div>
                                <div className="absolute inset-4 bg-gradient-to-tr from-primary to-secondary rounded-full shadow-[0_0_80px_rgba(70,71,211,0.4)] animate-[pulse_2s_infinite]"></div>
                                
                                <div className="relative z-10 flex items-center justify-center h-16 gap-1.5">
                                    <div className="w-1.5 h-8 bg-surface rounded-full animate-[bounce_1s_infinite]"></div>
                                    <div className="w-1.5 h-16 bg-surface rounded-full animate-[bounce_1.2s_infinite_0.1s]"></div>
                                    <div className="w-1.5 h-10 bg-surface rounded-full animate-[bounce_0.9s_infinite_0.2s]"></div>
                                    <div className="w-1.5 h-14 bg-surface rounded-full animate-[bounce_1.1s_infinite_0.3s]"></div>
                                    <div className="w-1.5 h-8 bg-surface rounded-full animate-[bounce_1.3s_infinite_0.4s]"></div>
                                </div>
                            </>
                        )}

                        {state === 'PROCESSING' && (
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="h-24 w-24 rounded-full border-[2px] border-primary border-t-transparent mx-auto shadow-[0_0_40px_rgba(70,71,211,0.2)]"
                            />
                        )}

                        {(state === 'CONFIRMATION' || state === 'ERROR') && (
                            <div className={clsx(
                                "h-32 w-32 rounded-full flex items-center justify-center text-surface mx-auto",
                                state === 'ERROR' ? "bg-error shadow-[0_0_60px_rgba(167,1,56,0.4)]" : "bg-primary shadow-[0_0_60px_rgba(70,71,211,0.4)]"
                            )}>
                                <span className="material-symbols-outlined text-[64px]">
                                    {state === 'ERROR' ? 'priority_high' : 'done_all'}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* Text content area */}
                    <div className="min-h-[150px]">
                        {state === 'LISTENING' && transcript && (
                            <p className="text-xl text-surface/90 font-black italic tracking-tight leading-relaxed px-4">
                                "{transcript}"
                            </p>
                        )}
                        
                        {state === 'LISTENING' && !transcript && (
                            <>
                                <p className="text-surface/30 mt-2 mb-4 font-black uppercase tracking-widest text-[10px]">Try saying</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <span className="bg-surface/5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-surface/10 text-surface/60 italic">"Spent $12 on coffee at Starbucks"</span>
                                    <span className="bg-surface/5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-surface/10 text-surface/60 italic">"I just got paid $200"</span>
                                </div>
                            </>
                        )}

                        {state === 'CONFIRMATION' && result && (
                            <div className="rounded-[2.5rem] bg-surface-container-lowest text-on-surface p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] mx-auto w-full max-w-sm border border-outline-variant/10">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 italic">I heard this:</span>
                                    <span className={clsx(
                                        "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1",
                                        result.type === 'income' ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
                                    )}>
                                        {result.type}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <p className="text-6xl font-black text-on-surface tracking-tighter leading-none font-headline">${result.amount}</p>
                                    <p className="text-xs font-black text-on-surface-variant/60 uppercase tracking-widest mt-2">{result.category} • {result.note || 'Unspecified'}</p>
                                </div>
                            </div>
                        )}

                        {state === 'ERROR' && (
                            <p className="text-sm text-error bg-error/10 py-4 px-8 rounded-full border border-error/20 inline-block font-black uppercase tracking-widest">
                                {error || "I didn't understand that"}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons underneath Confirmation/Error */}
                    <AnimatePresence>
                        {state === 'CONFIRMATION' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col gap-3 w-full mt-8 max-w-sm mx-auto"
                            >
                                <button 
                                    onClick={onConfirm}
                                    className="w-full rounded-2xl bg-primary hover:bg-primary/90 py-5 font-black uppercase tracking-[0.2em] text-xs text-surface shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex justify-center items-center gap-3"
                                >
                                    Yes, save it
                                </button>
                                <div className="flex gap-3 w-full">
                                    <button 
                                        onClick={onCancel}
                                        className="flex-1 rounded-2xl bg-surface/5 border border-surface/10 py-4 font-black uppercase tracking-widest text-[10px] text-surface hover:bg-surface/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={onEdit}
                                        className="flex-1 rounded-2xl border border-primary/30 bg-primary/10 py-4 font-black uppercase tracking-widest text-[10px] text-primary hover:bg-primary/20 transition-all"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </motion.div>
                        )}
                        
                        {state === 'ERROR' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4 justify-center mt-8 max-w-sm mx-auto w-full"
                            >
                                <button 
                                    onClick={onRetry}
                                    className="flex-1 rounded-2xl bg-surface py-5 font-black uppercase tracking-widest text-[10px] text-on-surface hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Try again
                                </button>
                                <button 
                                    onClick={onCancel}
                                    className="flex-1 rounded-2xl border border-surface/10 bg-surface/5 py-5 font-black uppercase tracking-widest text-[10px] text-surface hover:bg-surface/10 transition-all"
                                >
                                    Close
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Bottom Action Area / Stop Listening Button */}
            {state === 'LISTENING' && (
                <div className="absolute bottom-12 left-0 w-full flex justify-center z-10">
                    <button 
                        onClick={onCancel}
                        className="w-20 h-20 bg-surface text-on-surface rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                    >
                        <span className="material-symbols-outlined text-[32px]">stop_circle</span>
                    </button>
                </div>
            )}
        </motion.div>
    )
}

export default VoiceOverlay
