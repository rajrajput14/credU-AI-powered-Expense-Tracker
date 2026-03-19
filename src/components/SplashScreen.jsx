import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'

const SplashScreen = () => {
    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-on-surface"
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
                    className="absolute h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"
                />

                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative mb-12"
                >
                    <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-secondary shadow-[0_20px_60px_rgba(70,71,211,0.4)] border border-white/20">
                        <Wallet className="text-surface" size={48} />
                    </div>
                    
                    {/* Pulsating Orbitals */}
                    <div className="absolute -inset-4 border border-primary/20 rounded-[2.5rem] animate-[ping_3s_infinite]" />
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-5xl font-headline font-black italic tracking-tighter text-surface uppercase">credU</h1>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
                        Control Your Capital.
                    </p>
                </motion.div>
            </div>

            {/* Scientific Loader */}
            <div className="absolute bottom-20 left-1/2 w-64 -translate-x-1/2">
                <div className="h-[2px] w-full overflow-hidden rounded-full bg-surface/5 border border-surface/5">
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ 
                            repeat: Infinity, 
                            duration: 1.2, 
                            ease: "linear" 
                        }}
                        className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
                    />
                </div>
                <div className="mt-4 flex justify-between px-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-surface/20">Initializing Shell</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-surface/20 text-right italic">v2.0.0</span>
                </div>
            </div>
        </motion.div>
    )
}

export default SplashScreen
