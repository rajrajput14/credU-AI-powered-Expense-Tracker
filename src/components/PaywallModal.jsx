import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const PaywallModal = () => {
    const { isPaywallOpen, setPaywallOpen, createCheckout, user } = useAppStore();

    const features = [
        { icon: 'all_inclusive', text: 'Unlimited transactions' },
        { icon: 'psychology', text: 'Advanced AI insights' },
        { icon: 'mic', text: 'Seamless voice tracking' },
        { icon: 'payments', text: 'Multi-currency support' },
    ];

    if (!isPaywallOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setPaywallOpen(false)}
                    className="absolute inset-0 bg-surface/80 backdrop-blur-xl"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-surface-container-lowest rounded-[32px] border border-outline-variant/10 shadow-2xl overflow-hidden p-8 sm:p-10"
                >
                    {/* Premium Gradient Background */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-3 font-headline">Upgrade to Pro</h2>
                        <p className="text-on-surface-variant text-base">Unlock unlimited tracking and smart insights to master your wealth.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container/50 border border-outline-variant/5">
                                <span className="material-symbols-outlined text-primary text-xl">{f.icon}</span>
                                <span className="text-sm font-bold text-on-surface-variant">{f.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => createCheckout(user?.id, user?.email, import.meta.env.VITE_POLAR_PRICE_ID)}
                            className="w-full py-4 bg-primary text-surface rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            <span>Upgrade Now</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                        <button 
                            onClick={() => setPaywallOpen(false)}
                            className="w-full py-4 bg-transparent text-on-surface-variant rounded-2xl font-black uppercase tracking-widest hover:bg-surface-container transition-all"
                        >
                            Maybe later
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaywallModal;
