import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'

const SplashScreen = () => {
    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-gradient-to-b from-[#0B0F1A] to-[#0F172A]"
        >
            <div className="relative flex flex-col items-center pb-20">
                {/* Glow Effect */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: 3,
                        ease: "easeInOut"
                    }}
                    className="absolute h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"
                />

                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative mb-8"
                >
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-2xl shadow-indigo-500/20">
                        <Wallet className="text-white" size={48} />
                    </div>
                    
                    {/* Sound Waves Animation */}
                    <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 h-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <motion.div 
                                key={i}
                                animate={{ height: [4, 12, 4] }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 0.6, 
                                    delay: i * 0.1 
                                }}
                                className="w-1 rounded-full bg-indigo-400"
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-black italic tracking-tighter text-white">VOXA</h1>
                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-400/80">
                        Say it. Track it.
                    </p>
                </motion.div>
            </div>

            {/* Loader Section */}
            <div className="absolute bottom-20 left-1/2 w-48 -translate-x-1/2">
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ 
                            repeat: Infinity, 
                            duration: 1.5, 
                            ease: "linear" 
                        }}
                        className="h-full w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                    />
                </div>
            </div>
        </motion.div>
    )
}

export default SplashScreen
