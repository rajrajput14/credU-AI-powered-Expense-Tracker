import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import clsx from 'clsx'

const highlightTranscript = (text) => {
    if (!text) return text;
    
    // RegEx for amounts (e.g., 200, 50, ₹100)
    const amountRegex = /(\d+[,.]?\d*)/g;
    
    // Common categories to highlight (can be expanded)
    const categoryKeywords = ['food', 'coffee', 'pizza', 'rent', 'salary', 'investment', 'petrol', 'fuel', 'netflix', 'groceries', 'uber', 'taxi', 'swiggy', 'zomato', 'dinner', 'lunch'];
    const categoryRegex = new RegExp(`\\b(${categoryKeywords.join('|')})\\b`, 'gi');

    let parts = [text];

    // Highlight amounts (bold)
    parts = parts.flatMap(part => {
        if (typeof part !== 'string') return [part];
        const subParts = part.split(amountRegex);
        return subParts.map((subPart, i) => {
            if (amountRegex.test(subPart)) {
                return <span key={`amt-${i}`} className="text-primary font-black scale-110 inline-block drop-shadow-[0_0_10px_rgba(70,71,211,0.4)]">{subPart}</span>;
            }
            return subPart;
        });
    });

    // Highlight categories (colored/italic)
    parts = parts.flatMap(part => {
        if (typeof part !== 'string') return [part];
        const subParts = part.split(categoryRegex);
        return subParts.map((subPart, i) => {
            if (categoryRegex.test(subPart)) {
                return <span key={`cat-${i}`} className="text-secondary font-black italic underline decoration-secondary/30">{subPart}</span>;
            }
            return subPart;
        });
    });

    return parts;
};

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
    const { formatCurrency } = useAppStore();
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050510]/95 backdrop-blur-3xl transition-all duration-500 overflow-hidden"
        >
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 w-full h-full max-w-4xl">
                {/* Close Button */}
                <button 
                    onClick={onCancel}
                    className="absolute top-8 right-8 w-14 h-14 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center transition-all shadow-2xl border border-white/5 group"
                >
                    <span className="material-symbols-outlined text-white/50 group-hover:text-white group-hover:rotate-90 transition-all">close</span>
                </button>

                <div className="text-center w-full font-body">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="text-primary font-black mb-6 uppercase tracking-[0.4em] text-[11px] italic drop-shadow-sm flex items-center justify-center gap-2">
                            <span className="w-8 h-[1px] bg-primary/30"></span>
                            WhisperFlow Engine
                            <span className="w-8 h-[1px] bg-primary/30"></span>
                        </p>
                        
                        <h1 className={clsx(
                            "text-4xl md:text-6xl font-black tracking-tighter mb-16 font-headline uppercase leading-none",
                            state === 'ERROR' ? "text-error" : "text-white"
                        )}>
                            {state === 'LISTENING' && (
                                <span className="animate-pulse">Listening...</span>
                            )}
                            {state === 'PROCESSING' && (
                                <motion.span 
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    Analyzing context...
                                </motion.span>
                            )}
                            {state === 'CONFIRMATION' && "Everything look right?"}
                            {state === 'ERROR' && "Try being more specific"}
                        </h1>
                    </motion.div>
                    
                    {/* Visual State Indicator */}
                    <div className="relative w-64 h-64 mx-auto mb-20 flex items-center justify-center">
                        {state === 'LISTENING' && (
                            <>
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        opacity: [0.2, 0.4, 0.2]
                                    }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className="absolute inset-0 bg-primary rounded-full blur-[60px]"
                                ></motion.div>
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                    className="absolute inset-2 border-[1px] border-dashed border-primary/30 rounded-full"
                                ></motion.div>
                                <div className="absolute inset-8 bg-gradient-to-br from-primary via-primary/80 to-secondary rounded-full shadow-[0_0_80px_rgba(70,71,211,0.6)] flex items-center justify-center">
                                    <div className="flex items-center justify-center h-20 gap-2">
                                        {[1, 2, 3, 4, 5, 2.5, 3.5].map((s, i) => (
                                            <motion.div 
                                                key={i}
                                                animate={{ height: [20, 60, 20] }}
                                                transition={{ 
                                                    repeat: Infinity, 
                                                    duration: 0.6 + (i * 0.1), 
                                                    delay: i * 0.05,
                                                    ease: "easeInOut"
                                                }}
                                                className="w-1.5 bg-white rounded-full opacity-80"
                                            ></motion.div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {state === 'PROCESSING' && (
                            <div className="relative">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    className="h-32 w-32 rounded-full border-[3px] border-primary border-t-transparent shadow-[0_0_50px_rgba(70,71,211,0.3)]"
                                />
                                <motion.div 
                                    animate={{ rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    className="absolute inset-4 rounded-full border-[2px] border-secondary border-b-transparent"
                                />
                            </div>
                        )}

                        {(state === 'CONFIRMATION' || state === 'ERROR') && (
                            <div className={clsx(
                                "h-40 w-40 rounded-full flex items-center justify-center text-white mx-auto relative group",
                                state === 'ERROR' ? "bg-error/20 border border-error/50 shadow-[0_0_60px_rgba(167,1,56,0.3)]" : "bg-primary/20 border border-primary/50 shadow-[0_0_60px_rgba(70,71,211,0.3)]"
                            )}>
                                <span className="material-symbols-outlined text-[80px] drop-shadow-2xl">
                                    {state === 'ERROR' ? 'warning' : 'auto_awesome'}
                                </span>
                                <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-inherit"></div>
                            </div>
                        )}
                    </div>
                    
                    {/* Text content area */}
                    <div className="min-h-[150px] px-4 max-w-2xl mx-auto">
                        <AnimatePresence mode="wait">
                            {state === 'LISTENING' && (
                                <motion.div
                                    key="listening"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {transcript ? (
                                        <p className="text-2xl md:text-3xl text-white font-medium italic tracking-tight leading-relaxed selection:bg-primary/30">
                                            "{highlightTranscript(transcript)}"
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-white/30 font-black uppercase tracking-[0.3em] text-[10px]">Speak naturally in any language</p>
                                            <div className="flex flex-wrap justify-center gap-3">
                                                {['"I spent 500 on dinner today"', '"Kal 200 kharcha kiya petrol pe"', '"Electricity bill paid 1500"'].map((tip, i) => (
                                                    <span key={i} className="bg-white/[0.03] px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-white/5 text-white/40 italic hover:bg-white/10 transition-colors cursor-default">
                                                        {tip}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {state === 'CONFIRMATION' && result && (
                                <motion.div 
                                    key="confirmation"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="rounded-[3rem] bg-white/[0.03] border border-white/10 p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                                >
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary italic">
                                                {result.isCorrection ? "Input Refined" : "Intelligent Match"}
                                            </span>
                                            {result.confidence && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${result.confidence * 100}%` }}
                                                            className={clsx(
                                                                "h-full",
                                                                result.confidence > 0.8 ? "bg-green-400" : result.confidence > 0.5 ? "bg-yellow-400" : "bg-error"
                                                            )}
                                                        />
                                                    </div>
                                                    <span className="text-[8px] font-black opacity-40 uppercase">{Math.round(result.confidence * 100)}% Confidence</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 rotate-12">
                                            <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-8">
                                        {result.transactions.map((tx, idx) => (
                                            <div key={idx} className={clsx(
                                                "flex items-center justify-between",
                                                idx !== result.transactions.length - 1 && "pb-8 border-b border-white/[0.03]"
                                            )}>
                                                <div className="flex flex-col items-start text-left gap-2">
                                                    <p className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
                                                        {tx.summary}
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <span className={clsx(
                                                            "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest",
                                                            tx.type === 'income' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                                        )}>
                                                            {tx.category}
                                                        </span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[10px]">calendar_today</span>
                                                            {tx.date}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end">
                                                    <p className={clsx(
                                                        "text-2xl md:text-3xl font-black tracking-tighter",
                                                        tx.type === 'income' ? "text-green-400" : "text-white"
                                                    )}>
                                                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {state === 'ERROR' && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-block"
                                >
                                    <p className="text-sm text-error bg-error/10 py-5 px-10 rounded-3xl border border-error/30 font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md">
                                        {error || "I didn't quite catch that"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Action Buttons */}
                    <AnimatePresence>
                        {state === 'CONFIRMATION' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="flex flex-col gap-4 w-full mt-12 max-w-md mx-auto relative z-20"
                            >
                                <button 
                                    onClick={onConfirm}
                                    className="w-full rounded-[2rem] bg-primary hover:bg-primary/90 py-6 font-black uppercase tracking-[0.3em] text-sm text-white shadow-[0_20px_40px_rgba(70,71,211,0.3)] hover:shadow-primary/40 hover:-translate-y-1 active:scale-[0.98] transition-all flex justify-center items-center gap-4 group"
                                >
                                    Confirm Entry
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                                <div className="flex gap-4 w-full">
                                    <button 
                                        onClick={onCancel}
                                        className="flex-1 rounded-[1.5rem] bg-white/[0.05] border border-white/10 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-[0.98]"
                                    >
                                        Dismiss
                                    </button>
                                    <button 
                                        onClick={onEdit}
                                        className="flex-1 rounded-[1.5rem] border border-primary/20 bg-primary/5 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-primary hover:bg-primary/10 transition-all active:scale-[0.98]"
                                    >
                                        Edit Details
                                    </button>
                                </div>
                            </motion.div>
                        )}
                        
                        {state === 'ERROR' && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-5 justify-center mt-12 max-w-sm mx-auto w-full px-6"
                            >
                                <button 
                                    onClick={onRetry}
                                    className="flex-1 rounded-3xl bg-white py-6 font-black uppercase tracking-[0.2em] text-[10px] text-black hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl"
                                >
                                    <span className="material-symbols-outlined text-sm">refresh</span>
                                    Try again
                                </button>
                                <button 
                                    onClick={onCancel}
                                    className="flex-1 rounded-3xl border border-white/10 bg-white/5 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-white hover:bg-white/10 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Tap to Stop listening button */}
            {state === 'LISTENING' && (
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-16 left-0 w-full flex flex-col items-center gap-6 z-20"
                >
                    <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[9px]">Tap to process</p>
                    <button 
                        onClick={onCancel}
                        className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-[0_0_80px_rgba(255,255,255,0.4)] group relative"
                    >
                        <span className="material-symbols-outlined text-[40px] group-hover:scale-110 transition-transform">mic_off</span>
                        <div className="absolute inset-[-8px] border border-white/20 rounded-full animate-ping"></div>
                    </button>
                </motion.div>
            )}
        </motion.div>
    )
}

export default VoiceOverlay
