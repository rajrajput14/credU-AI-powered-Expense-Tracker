import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAppStore } from '../store/useAppStore';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import ProfileEditModal from '../components/ProfileEditModal';
import PageTransition from '../components/animations/PageTransition';
import AnimatedCard from '../components/animations/AnimatedCard';
import CurrencySelector from '../components/CurrencySelector';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

const Settings = () => {
    const navigate = useNavigate();
    const { user, currency, setCurrency, theme, setTheme, subscription, isPro, createCheckout, getMonthlyTransactionCount, setPaywallOpen } = useAppStore();
    const [notifications, setNotifications] = useState(true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [currentVersion, setCurrentVersion] = useState('1.0.0');

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const latest = await CapacitorUpdater.getLatest();
                if (latest?.version) {
                    setCurrentVersion(latest.version);
                }
            } catch (e) {
                console.warn('Failed to fetch native version:', e);
            }
        };
        fetchVersion();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    const handleLinkAccount = () => {
        alert("Linking accounts is a premium feature coming soon!");
    };

    const handleUpgrade = async () => {
        if (!user) return navigate('/auth');
        setIsUpgrading(true);
        try {
            await createCheckout(
                user.id, 
                user.email, 
                import.meta.env.VITE_POLAR_PRICE_ID || 'your_polar_price_id',
                import.meta.env.VITE_POLAR_PRODUCT_ID || '4ee35c5b-a988-4938-aa9f-1802173ef26b'
            );
        } finally {
            setIsUpgrading(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!subscription?.polar_subscription_id) return;
        if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
            const success = await useAppStore.getState().cancelSubscription(subscription.polar_subscription_id);
            if (success) {
                alert('Subscription canceled successfully.');
            }
        }
    };

    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const email = user?.email || 'No email provided';

    return (
        <div className="flex-1 flex flex-col w-full font-body">
            <header className="h-16 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10 flex items-center justify-between px-8 shrink-0 z-10 w-full lg:flex hidden">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-on-surface-variant hover:text-on-surface cursor-pointer font-medium transition-colors">App</span>
                    <span className="text-on-surface-variant/40">/</span>
                    <span className="text-on-surface font-black">Settings</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="material-symbols-outlined text-on-surface-variant/60 hover:text-on-surface transition-colors">notifications</button>
                    <Link to="/app-dashboard/settings" className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant/10 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                        <img 
                            src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.user_metadata?.avatar_seed || user?.email || 'Felix'}&backgroundColor=e2e8f0`} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                        />
                    </Link>
                </div>
            </header>

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto w-full">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold tracking-tight text-on-surface mb-1 font-headline">Account & Settings</h1>
                    <p className="text-on-surface-variant text-sm font-medium">Manage your profile and app settings.</p>
                </div>

                <div className="space-y-6 pb-12 z-0">

                    <AnimatedCard delay={0.1} className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                        <div className="w-24 h-24 rounded-full bg-surface-container border-4 border-surface shadow-xl flex items-center justify-center shrink-0 relative overflow-hidden group cursor-pointer z-10" onClick={() => setIsProfileModalOpen(true)}>
                            <img 
                                src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.user_metadata?.avatar_seed || user?.email || 'Felix'}&backgroundColor=e2e8f0`} 
                                alt="Profile" 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white">photo_camera</span>
                            </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left z-10">
                            <h2 className="text-xl font-bold text-on-surface capitalize font-headline">{name}</h2>
                            <p className="text-on-surface-variant text-sm mb-4 opacity-60">{email}</p>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <span className={clsx(
                                    "text-[10px] font-black capitalize px-3 py-1 rounded-full shadow-sm",
                                    isPro() ? "bg-gradient-to-r from-secondary to-secondary-dim text-surface" : "bg-gradient-to-r from-primary to-primary-dim text-surface"
                                )}>
                                {subscription?.plan ? `${subscription.plan} plan` : 'Free plan'}
                                </span>
                            </div>
                        </div>
                        <div className="z-10 w-full sm:w-auto mt-4 sm:mt-0">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsProfileModalOpen(true)}
                                className="w-full bg-surface-container-lowest border border-outline-variant/20 hover:bg-surface-container/20 text-on-surface font-black capitalize px-4 py-2 rounded-xl transition-colors shadow-sm text-[10px]"
                            >
                                Edit profile
                            </motion.button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
                    </AnimatedCard>

                    {/* Usage & Billing Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Billing Card */}
                        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col relative group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                             
                             <div className="px-6 py-5 border-b border-outline-variant/5 flex items-center gap-3 shrink-0 relative z-10">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">payments</span></div>
                                <h3 className="font-bold text-on-surface font-headline capitalize text-sm">Billing & Plan</h3>
                            </div>
                            
                            <div className="p-6 flex-1 space-y-6 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black capitalize text-on-surface-variant/40 mb-1">Current Plan</p>
                                        <h4 className="text-2xl font-black text-on-surface tracking-tighter capitalize">{subscription?.plan || 'Free Member'}</h4>
                                    </div>
                                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black capitalize">
                                        {subscription?.status || 'Active'}
                                    </div>
                                </div>

                                <div className="bg-surface-container/30 rounded-2xl p-4 border border-outline-variant/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-on-surface-variant">Next Payment</span>
                                        <span className="text-xs font-black text-on-surface">{subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <p className="text-[10px] font-medium text-on-surface-variant/60 leading-snug">
                                        {isPro() ? 'Your subscription automatically renews. Manage it via the button below.' : 'Upgrade to Pro to unlock unlimited transactions and AI insights.'}
                                    </p>
                                </div>

                                {isPro() ? (
                                    <button 
                                        onClick={handleCancelSubscription}
                                        className="w-full bg-error/10 hover:bg-error/20 text-error font-black capitalize py-3 rounded-2xl transition-all shadow-sm text-[10px] border border-error/10"
                                    >
                                        Cancel Subscription
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleUpgrade}
                                        disabled={isUpgrading}
                                        className={clsx(
                                            "w-full fluid-gradient text-white font-black capitalize py-3 rounded-2xl transition-all shadow-lg shadow-primary/20 text-[10px] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2",
                                            isUpgrading && "opacity-70 cursor-wait"
                                        )}
                                    >
                                        {isUpgrading ? (
                                            <>
                                                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : 'Upgrade to Pro'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Usage Meter Card */}
                        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm flex flex-col">
                            <div className="px-6 py-5 border-b border-outline-variant/5 flex items-center gap-3 shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">monitoring</span></div>
                                <h3 className="font-bold text-on-surface font-headline capitalize text-sm">Monthly Usage</h3>
                            </div>
                            
                            <div className="p-6 space-y-8 flex-1">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="font-bold text-on-surface text-sm mb-1 font-headline">Transactions</p>
                                            <p className="text-[10px] font-black capitalize text-on-surface-variant/40">{getMonthlyTransactionCount()} of {isPro() ? '∞' : '20'} used</p>
                                        </div>
                                        <span className="text-xs font-black text-primary">{Math.min(Math.round((getMonthlyTransactionCount() / 20) * 100), 100)}%</span>
                                    </div>
                                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((getMonthlyTransactionCount() / 20) * 100, 100)}%` }}
                                            className="bg-primary h-full"
                                        />
                                    </div>
                                </div>

                                <div className="bg-secondary/5 rounded-2xl p-4 border border-secondary/10">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-secondary">info</span>
                                        <p className="text-[10px] font-medium text-secondary leading-relaxed">
                                            Usage resets on the 1st of every month. {isPro() ? 'You have unlimited access.' : 'Upgrade for higher limits.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm flex flex-col z-20 relative">
                            <div className="px-6 py-5 border-b border-outline-variant/5 flex items-center gap-3 shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">tune</span></div>
                                <h3 className="font-bold text-on-surface font-headline capitalize text-sm">App settings</h3>
                            </div>
                            <div className="divide-y divide-outline-variant/5 flex-1 relative">
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Dark mode</p>
                                        <p className="text-[10px] font-black capitalize text-on-surface-variant/40">Switch between light and dark themes.</p>
                                    </div>
                                    <button
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                        className={clsx(
                                            "w-11 h-6 rounded-full transition-all relative",
                                            theme === 'dark' ? "bg-primary shadow-lg shadow-primary/20" : "bg-surface-container"
                                        )}
                                    >
                                        <div className={clsx(
                                            "absolute top-1 w-4 h-4 rounded-full transition-all",
                                            theme === 'dark' ? "left-6 bg-surface shadow-sm" : "left-1 bg-on-surface-variant/30"
                                        )}></div>
                                    </button>
                                </div>
                                <div className="p-6 flex items-center justify-between relative z-50">
                                    <div>
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Currency</p>
                                        <p className="text-[10px] font-black capitalize text-on-surface-variant/40">Choose your local currency.</p>
                                    </div>
                                    <CurrencySelector />
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm flex flex-col">
                            <div className="px-6 py-5 border-b border-outline-variant/5 flex items-center gap-3 shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">notifications</span></div>
                                <h3 className="font-bold text-on-surface font-headline capitalize text-sm">Notifications</h3>
                            </div>
                            <div className="divide-y divide-outline-variant/5 flex-1">
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Large spends</p>
                                        <p className="text-[10px] font-black capitalize text-on-surface-variant/40">Get notified for big expenses.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-lg shadow-primary/20">
                                        <div className="w-4 h-4 bg-surface rounded-full absolute top-1 right-1 shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Weekly report</p>
                                        <p className="text-[10px] font-black capitalize text-on-surface-variant/40">A summary of your week.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-lg shadow-primary/20">
                                        <div className="w-4 h-4 bg-surface rounded-full absolute top-1 right-1 shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm flex flex-col mb-6">
                        <div className="px-6 py-5 border-b border-outline-variant/5 flex items-center gap-3 shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">info</span></div>
                            <h3 className="font-bold text-on-surface font-headline capitalize text-sm">App Information</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-on-surface-variant font-medium">Native Version</span>
                                <span className="text-on-surface font-black">{currentVersion}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-on-surface-variant font-medium">Build Type</span>
                                <span className="text-on-surface font-black capitalize text-[10px]">Production</span>
                            </div>
                            <button 
                                onClick={() => {
                                    import('../services/LiveUpdateService').then(m => m.LiveUpdateService.checkForUpdates());
                                    alert('Checking for updates in the background. If a new version is found, it will be downloaded and applied on next restart.');
                                }}
                                className="w-full bg-surface-container/50 border border-outline-variant/10 hover:bg-surface-container text-on-surface font-black capitalize py-3 rounded-2xl transition-all shadow-sm text-[10px]"
                            >
                                Check for Updates
                            </button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button onClick={handleSignOut} className="w-full bg-surface-container-lowest border border-error/10 text-error hover:bg-error/5 hover:border-error/20 font-black capitalize px-4 py-3 rounded-2xl transition-all shadow-sm text-xs flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">logout</span> Log out
                        </button>
                    </div>
                </div>
            </div>

            <ProfileEditModal 
                isOpen={isProfileModalOpen} 
                onClose={() => setIsProfileModalOpen(false)} 
            />
        </div>
    );
};

export default Settings;
