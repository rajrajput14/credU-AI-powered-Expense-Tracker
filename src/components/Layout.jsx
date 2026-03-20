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

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { 
        user, 
        isTransactionModalOpen, 
        setTransactionModal,
        isGoalModalOpen,
        setGoalModal,
        isFundGoalModalOpen,
        setFundGoalModal,
        activeTransaction,
        activeGoal,
        triggerVoice
    } = useAppStore();

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate('/auth')
    }

    const navItems = [
        { path: '/app-dashboard', icon: 'grid_view', label: 'Home' },
        { path: '/app-dashboard/transactions', icon: 'list_alt', label: 'Expenses' },
        { path: '/app-dashboard/analytics', icon: 'analytics', label: 'Insights' },
        { path: '/app-dashboard/goals', icon: 'track_changes', label: 'Savings Goals' },
        { path: '/app-dashboard/settings', icon: 'settings', label: 'Settings' }
    ];

    return (
        <div className="bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container pb-24 lg:pb-0 lg:flex lg:h-screen lg:overflow-hidden relative font-body">
            <OfflineBanner />
            {/* DESKTOP SIDEBAR */}
            <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant/10 hidden lg:flex flex-col justify-between shrink-0 relative z-20">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">c</div>
                        <span className="text-xl font-bold tracking-tight text-on-surface font-headline">credU.</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between overflow-y-auto px-6">
                        <div className="space-y-6">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setTransactionModal(true)}
                                className="w-full bg-on-surface text-white rounded-2xl py-3.5 px-4 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
                            >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>Add Expense</span>
                        </motion.button>

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
                                            <span className="font-semibold">{item.label}</span>
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
                                <div className="w-full h-full bg-white rounded-full border-2 border-white flex items-center justify-center">
                                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.user_metadata?.avatar_seed || user?.email || 'Felix'}&backgroundColor=e2e8f0`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors uppercase">{user?.email?.split('@')[0] || 'User'}</p>
                                <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider truncate">Premium member</p>
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
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.user_metadata?.avatar_seed || user?.email || 'Felix'}&backgroundColor=e2e8f0`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </Link>
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">c</div>
                        <span className="text-xl font-bold tracking-tight text-on-surface font-headline">credU.</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <PageTransition key={location.pathname} className="flex-1 flex flex-col w-full">
                        <Outlet />
                    </PageTransition>
                </AnimatePresence>
            </main>

            {/* MOBILE BOTTOM NAVIGATION */}
            <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-outline-variant/10 flex items-center justify-around px-2 py-3 z-50 lg:hidden pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
                {navItems.map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.path}
                            to={item.path} 
                            className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all
                                ${isActive ? 'text-primary' : 'text-on-surface-variant/60 hover:text-on-surface-variant cursor-pointer'}`
                            }>
                            <span className="material-symbols-outlined text-[24px] mb-0.5">{item.icon}</span>
                            {isActive && <div className="w-1 h-1 rounded-full bg-primary"></div>}
                        </Link>
                    )
                })}
            </nav>
            {/* MOBILE FAB */}
            <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="fixed bottom-24 right-6 lg:hidden z-50"
            >
                <button 
                    onClick={() => setTransactionModal(true)}
                    className="w-14 h-14 bg-on-surface text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-on-surface/40 active:scale-95 transition-all hover:bg-on-surface/90"
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
        </div>
    );
};

export default Layout;
