import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { supabase } from '../services/supabase';
import VoiceButton from './VoiceButton';
import { useAppStore } from '../store/useAppStore';
import TransactionFormModal from './TransactionFormModal';
import GoalFormModal from './GoalFormModal';
import FundGoalModal from './FundGoalModal';
import OfflineBanner from './OfflineBanner';
import PageTransition from './animations/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import PaywallModal from './PaywallModal';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { 
        user, 
        subscription,
        isTransactionModalOpen, 
        setTransactionModal,
        isGoalModalOpen,
        setGoalModal,
        isFundGoalModalOpen,
        setFundGoalModal,
        activeTransaction,
        activeGoal,
        triggerVoice,
        isLimitReached,
        setPaywallOpen,
        isPro,
        voiceEntry,
        clearVoiceEntry,
        theme
    } = useAppStore();

    useEffect(() => {
        if (voiceEntry) {
            setTransactionModal(true, voiceEntry);
            clearVoiceEntry();
        }
    }, [voiceEntry, setTransactionModal, clearVoiceEntry]);

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate('/auth')
    }

    const handleAddTransactionClick = () => {
        if (isLimitReached()) {
            setPaywallOpen(true);
        } else {
            setTransactionModal(true);
        }
    };

    const navItems = [
        { name: 'Dashboard', path: '/app-dashboard', icon: 'grid_view' },
        { name: 'Insights', path: '/app-dashboard/analytics', icon: 'analytics' },
        { name: 'Transactions', path: '/app-dashboard/transactions', icon: 'receipt_long' },
        { name: 'Goals', path: '/app-dashboard/goals', icon: 'savings' },
        { name: 'Settings', path: '/app-dashboard/settings', icon: 'settings' },
    ];

    return (
        <div className="bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container pb-24 lg:pb-0 lg:flex lg:h-screen lg:overflow-hidden relative font-body">
            <OfflineBanner />
            {/* DESKTOP SIDEBAR */}
            <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant/10 hidden lg:flex flex-col justify-between shrink-0 relative z-20">
                <div className="p-6">
                    <Link to="/app-dashboard" className="flex items-center gap-2 mb-10 group overflow-hidden">
                        <img 
                            src={theme === 'dark' ? '/assets/branding/logo-dark.png' : '/assets/branding/logo-light.png'} 
                            alt="credU" 
                            className="h-16 w-auto object-contain transition-transform group-hover:scale-105" 
                        />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between overflow-y-auto px-6">
                        <div className="space-y-6">
                            <button 
                                    onClick={handleAddTransactionClick}
                                    className="w-full bg-on-surface text-white rounded-2xl py-4 font-black capitalize text-xs flex items-center justify-center gap-2 hover:bg-on-surface/90 transition-all shadow-lg shadow-on-surface/20"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                    Add transaction
                                </button>

                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path || 
                                                    (item.path === '/app-dashboard' && location.pathname === '/app-dashboard/');
                                    return (
                                        <Link 
                                            key={item.path}
                                            to={item.path}
                                            className={clsx(
                                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group",
                                                isActive ? "bg-primary/10 text-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                                            )}
                                        >
                                            <span className={clsx(
                                                "material-symbols-outlined text-[22px]",
                                                isActive && "font-variation-fill"
                                            )}>{item.icon}</span>
                                            <span className="font-semibold">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="pt-4 border-t border-outline-variant/10 flex flex-col gap-1">
                                <button 
                                    onClick={triggerVoice}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant/50 flex items-center justify-center group-hover:bg-white transition-colors"><span className="material-symbols-outlined text-[20px]">mic</span></div>
                                    <span className="font-semibold">Tap to speak</span>
                                </button>
                                <Link 
                                    to="/app-dashboard/support"
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant/50 flex items-center justify-center group-hover:bg-white transition-colors"><span className="material-symbols-outlined text-[20px]">help_center</span></div>
                                    <span className="font-semibold">Need help?</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container group transition-colors">
                        <Link to="/app-dashboard/settings" className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                                <div className="w-full h-full bg-white rounded-full border-2 border-white flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.user_metadata?.avatar_seed || user?.email || 'Felix'}&backgroundColor=e2e8f0`} 
                                        alt="Profile" 
                                        className="w-full h-full rounded-full object-cover" 
                                    />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors capitalize">{user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</p>
                                <div className="flex items-center justify-between">
                                    <p className={clsx(
                                        "text-[10px] font-bold capitalize truncate",
                                        isPro() ? "text-primary" : "text-on-surface-variant/60"
                                    )}>
                                        {isPro() ? 'Premium member' : 'Free plan'}
                                    </p>
                                    {!isPro() && (
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setPaywallOpen(true);
                                            }}
                                            className="text-[10px] font-black text-primary capitalize hover:underline"
                                        >
                                            Upgrade
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Link>
                        <motion.button 
                            whileHover={{ scale: 1.1, color: '#b41340' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSignOut} 
                            className="material-symbols-outlined text-on-surface-variant transition-colors"
                        >
                            logout
                        </motion.button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col relative w-full lg:w-[calc(100%-16rem)] lg:h-screen lg:overflow-y-auto bg-surface">
                {/* MOBILE TOP BAR */}
                <div className="w-full bg-white/60 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-6 py-4 sticky top-0 z-50 lg:hidden">
                <Link to="/app-dashboard/settings" className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px] cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all shadow-sm">
                    <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden">
                        <img 
                            src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.user_metadata?.avatar_seed || user?.email || 'Felix'}&backgroundColor=e2e8f0`} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                </Link>
                    <Link to="/app-dashboard" className="flex items-center gap-1">
                        <img 
                            src={theme === 'dark' ? '/assets/branding/logo-dark.png' : '/assets/branding/logo-light.png'} 
                            alt="credU" 
                            className="h-12 w-auto object-contain" 
                        />
                    </Link>
                </div>

                <AnimatePresence mode="wait">
                    <PageTransition key={location.pathname} className="flex-1 flex flex-col w-full">
                        <Outlet />
                    </PageTransition>
                </AnimatePresence>
            </main>

            {/* MOBILE BOTTOM NAVIGATION */}
            <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-outline-variant/10 flex items-center justify-around px-2 py-4 z-50 lg:hidden pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
                {navItems.map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.path}
                            to={item.path} 
                            className={clsx(
                                "flex flex-col items-center justify-center gap-1.5 w-16 transition-all duration-300",
                                isActive ? 'text-primary scale-110' : 'text-on-surface-variant/40 hover:text-on-surface-variant cursor-pointer'
                            )}
                        >
                            <span className="material-symbols-outlined text-[26px] mb-0.5">{item.icon}</span>
                            <span className={clsx(
                                "text-[10px] font-black capitalize transition-all",
                                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
            {/* MOBILE FAB */}
            <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="fixed bottom-[184px] right-6 lg:hidden z-50 group"
            >
                <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-on-surface text-white text-[10px] font-black capitalize px-2 py-1 rounded-md pointer-events-none shadow-xl border border-white/10">
                    Add Transaction
                </div>
                <button 
                    onClick={handleAddTransactionClick}
                    className="w-16 h-16 bg-on-surface text-white rounded-full flex items-center justify-center shadow-2xl shadow-on-surface/40 active:scale-95 transition-all hover:bg-on-surface/90 border border-white/10"
                >
                    <span className="material-symbols-outlined text-[28px]">add</span>
                </button>
            </motion.div>

            <VoiceButton />

            {/* Global Modals */}
            <TransactionFormModal 
                isOpen={isTransactionModalOpen} 
                onClose={() => setTransactionModal(false)} 
                transaction={activeTransaction}
            />
            <GoalFormModal 
                isOpen={isGoalModalOpen} 
                onClose={() => setGoalModal(false)} 
                goal={activeGoal}
            />
            <FundGoalModal 
                isOpen={isFundGoalModalOpen} 
                onClose={() => setFundGoalModal(false)} 
                goal={activeGoal}
            />
            
            <PaywallModal />
        </div>
    );
};

export default Layout;
