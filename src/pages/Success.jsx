import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import AnimatedCard from '../components/animations/AnimatedCard';

const Success = () => {
    const [searchParams] = useSearchParams();
    const checkoutId = searchParams.get('checkout_id');
    const { fetchInitialData, user } = useAppStore();

    useEffect(() => {
        if (user) {
            // Refresh data to show Pro status immediately if possible
            fetchInitialData(user.id);
        }
    }, [user, fetchInitialData]);

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <AnimatedCard className="max-w-md w-full bg-surface-container-lowest rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-2xl relative overflow-hidden text-center">
                <div className="relative z-10">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                        className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dim rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-white text-5xl">check_circle</span>
                    </motion.div>

                    <h1 className="text-3xl font-black text-on-surface mb-3 tracking-tighter uppercase italic font-headline">Welcome to Pro!</h1>
                    <p className="text-on-surface-variant font-medium mb-10 leading-relaxed">
                        Your subscription was successful. You now have unlimited access to AI insights and premium features.
                    </p>

                    <div className="space-y-4">
                        <Link 
                            to="/app-dashboard" 
                            className="block w-full fluid-gradient text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] text-xs"
                        >
                            Go to Dashboard
                        </Link>
                        <Link 
                            to="/app-dashboard/settings" 
                            className="block w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-black uppercase tracking-widest py-4 rounded-2xl transition-all text-xs"
                        >
                            View Subscription
                        </Link>
                    </div>

                    {checkoutId && (
                        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/30 leading-snug">
                            Transaction ID: {checkoutId}
                        </p>
                    )}
                </div>
            </AnimatedCard>
        </div>
    );
};

export default Success;
