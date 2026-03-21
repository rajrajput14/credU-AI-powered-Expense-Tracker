import { motion } from 'framer-motion'

const SplashScreen = () => {
    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface overflow-hidden"
        >
            <style>
                {`
                @keyframes fluid-bg {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes drift {
                    0% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0, 0) scale(1); }
                }
                @keyframes drift-reverse {
                    0% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-40px, 40px) scale(1.2); }
                    66% { transform: translate(50px, -30px) scale(0.8); }
                    100% { transform: translate(0, 0) scale(1); }
                }
                @keyframes float-particle {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 0.4; }
                    90% { opacity: 0.4; }
                    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
                }
                @keyframes pulse-organic {
                    0%, 100% { transform: scale(1); opacity: 0.4; filter: blur(40px); }
                    50% { transform: scale(1.15); opacity: 0.7; filter: blur(65px); }
                }
                @keyframes logo-reveal {
                    0% { opacity: 0; transform: scale(0.95); filter: blur(10px); }
                    100% { opacity: 1; transform: scale(1); filter: blur(0px); }
                }
                @keyframes stagger-text {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fluid-gradient {
                    background: linear-gradient(-45deg, #0e0e0e, #131313, #1a0b2e, #2d005a, #0e0e0e);
                    background-size: 400% 400%;
                    animation: fluid-bg 20s ease infinite;
                }
                .animate-logo {
                    animation: logo-reveal 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .animate-organic-pulse {
                    animation: pulse-organic 6s ease-in-out infinite;
                }
                .animate-tagline {
                    animation: stagger-text 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.6s forwards;
                    opacity: 0;
                }
                .glass-overlay {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .particle {
                    position: absolute;
                    background: white;
                    border-radius: 50%;
                    pointer-events: none;
                    opacity: 0;
                }
                `}
            </style>

            <main className="relative h-full w-full flex flex-col items-center justify-center animate-fluid-gradient">
                {/* Sophisticated Fluid Layers */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] rounded-full bg-primary/10 blur-[140px]" style={{ animation: 'drift 25s linear infinite' }}></div>
                    <div className="absolute top-[20%] -right-[15%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px]" style={{ animation: 'drift-reverse 18s linear infinite' }}></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" style={{ animation: 'drift 30s ease-in-out infinite alternate' }}></div>
                </div>

                {/* 3D Parallax Particles */}
                <div className="absolute inset-0 pointer-events-none z-[1]">
                    <div className="particle w-1 h-1 top-[110%] left-[15%]" style={{ animation: 'float-particle 8s infinite 0s' }}></div>
                    <div className="particle w-0.5 h-0.5 top-[110%] left-[45%]" style={{ animation: 'float-particle 15s infinite 2s' }}></div>
                    <div className="particle w-1 h-1 top-[110%] left-[75%]" style={{ animation: 'float-particle 12s infinite 5s' }}></div>
                    <div className="particle w-0.5 h-0.5 top-[110%] left-[25%]" style={{ animation: 'float-particle 20s infinite 1s' }}></div>
                    <div className="particle w-1 h-1 top-[110%] left-[60%]" style={{ animation: 'float-particle 10s infinite 7s' }}></div>
                </div>

                {/* Center Identity */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-primary/20 rounded-full animate-organic-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full animate-organic-pulse" style={{ animationDelay: '-3s' }}></div>
                    
                    <div className="animate-logo flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-primary/10 rounded-lg blur-xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                            <img 
                                src="/assets/branding/logo-dark.png" 
                                alt="credU" 
                                className="h-28 md:h-44 w-auto object-contain" 
                            />
                        </div>
                        <p className="animate-tagline mt-8 text-on-surface/50 font-medium tracking-[0.3em] uppercase text-[10px] md:text-xs">
                            Take control of your money
                        </p>
                    </div>
                </div>

                {/* Footer Subtle Glass Interaction */}
                <div className="absolute bottom-16 left-0 right-0 px-8 flex justify-center animate-tagline" style={{ animationDelay: '1.2s' }}>
                    <div className="glass-overlay py-3.5 px-8 rounded-full flex items-center shadow-2xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_12px_#d2bbff] animate-pulse"></div>
                        <span className="ml-4 text-[9px] text-on-surface/40 font-bold tracking-[0.25em]">SECURE LEDGER ACTIVE</span>
                    </div>
                </div>

                {/* Geometric Micro-Details */}
                <div className="absolute top-20 right-12 w-32 h-32 border-[0.5px] border-outline-variant/10 rounded-full rotate-45 pointer-events-none"></div>
                <div className="absolute bottom-32 left-10 w-40 h-40 glass-overlay rounded-2xl -rotate-12 opacity-10 pointer-events-none"></div>
            </main>
        </motion.div>
    )
}

export default SplashScreen
