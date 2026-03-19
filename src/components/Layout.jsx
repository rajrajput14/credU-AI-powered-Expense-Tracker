import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { supabase } from '../services/supabase';
import VoiceButton from './VoiceButton';
import { useAppStore } from '../store/useAppStore';
import TransactionFormModal from './TransactionFormModal';
import GoalFormModal from './GoalFormModal';
import FundGoalModal from './FundGoalModal';

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
        { path: '/app-dashboard', icon: 'grid_view', label: 'Dashboard' },
        { path: '/app-dashboard/transactions', icon: 'list_alt', label: 'Transactions' },
        { path: '/app-dashboard/analytics', icon: 'analytics', label: 'Analytics' },
        { path: '/app-dashboard/goals', icon: 'track_changes', label: 'Goals & Planning' },
        { path: '/app-dashboard/settings', icon: 'settings', label: 'Settings' }
    ];

    return (
        <div className="bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container pb-24 lg:pb-0 lg:flex lg:h-screen lg:overflow-hidden relative font-body">
            {/* DESKTOP SIDEBAR */}
            <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant/10 hidden lg:flex flex-col justify-between shrink-0 relative z-20">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">c</div>
                        <span className="text-xl font-bold tracking-tight text-on-surface font-headline">credU.</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between overflow-y-auto px-6">
                        <div className="space-y-6">
                            <button 
                                onClick={() => setTransactionModal(true)}
                                className="w-full bg-on-surface text-white rounded-2xl py-3.5 px-4 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
                            >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                <span>New Transaction</span>
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
                                    <span className="font-semibold">Voice Entry</span>
                                </button>
                                <button 
                                    onClick={() => alert("Help Center coming soon!")}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant/50 flex items-center justify-center group-hover:bg-white transition-colors"><span className="material-symbols-outlined text-[20px]">help_center</span></div>
                                    <span className="font-semibold">Help & Support</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container cursor-pointer transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                            <div className="w-full h-full bg-white rounded-full border-2 border-white flex items-center justify-center">
                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'Felix'}&backgroundColor=e2e8f0`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors uppercase">{user?.email?.split('@')[0] || 'User'}</p>
                            <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider truncate">Pro Account</p>
                        </div>
                        <button onClick={handleSignOut} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">logout</button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col relative w-full lg:w-[calc(100%-16rem)] lg:h-screen lg:overflow-y-auto bg-surface">
                {/* MOBILE TOP BAR */}
                <div className="w-full bg-white/60 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-6 py-4 sticky top-0 z-50 lg:hidden">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                        <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'Felix'}&backgroundColor=e2e8f0`} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">c</div>
                        <span className="text-xl font-bold tracking-tight text-on-surface font-headline">credU.</span>
                    </div>
                </div>

                <Outlet />
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
