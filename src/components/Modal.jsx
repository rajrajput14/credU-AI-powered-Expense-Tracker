import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-outline-variant/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/5 bg-surface-container-lowest sticky top-0 z-10 shrink-0">
                            <h2 className="text-xl font-bold tracking-tight text-on-surface font-headline uppercase tracking-widest">{title}</h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:bg-surface-container/20 hover:text-on-surface transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
