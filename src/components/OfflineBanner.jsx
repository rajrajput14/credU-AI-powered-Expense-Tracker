import React from 'react';
import { useOffline } from '../hooks/useOffline';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineBanner = () => {
    const isOffline = useOffline();

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-error text-white text-xs font-bold py-2 px-4 flex items-center justify-center gap-2 sticky top-0 z-[100] overflow-hidden"
                >
                    <span className="material-symbols-outlined text-[16px]">cloud_off</span>
                    <span>You're offline. Check your internet connection.</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OfflineBanner;
