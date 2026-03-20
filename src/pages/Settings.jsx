import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAppStore } from '../store/useAppStore';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import ProfileEditModal from '../components/ProfileEditModal';
import PageTransition from '../components/animations/PageTransition';
import AnimatedCard from '../components/animations/AnimatedCard';

const Settings = () => {
    const navigate = useNavigate();
    const { user, currency, setCurrency, darkMode, setDarkMode, subscription, isPro, createCheckout } = useAppStore();
    const [notifications, setNotifications] = useState(true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const handleLinkAccount = () => {
        alert("Linking accounts is a premium feature coming soon!");
    };

    const handleUpgrade = async () => {
        if (!user) return navigate('/auth');
        await createCheckout(user.id, user.email, import.meta.env.VITE_POLAR_PRICE_ID);
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
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'Felix'}&backgroundColor=e2e8f0`} alt="Profile" className="w-full h-full object-cover" />
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
                        <div className="w-24 h-24 rounded-full bg-surface-container border-4 border-surface shadow-xl flex items-center justify-center shrink-0 relative overflow-hidden group cursor-pointer z-10">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'Felix'}&backgroundColor=e2e8f0`} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white">photo_camera</span>
                            </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left z-10">
                            <h2 className="text-xl font-bold text-on-surface capitalize font-headline">{name}</h2>
                            <p className="text-on-surface-variant text-sm mb-4 italic opacity-60">{email}</p>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <span className={clsx(
                                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm",
                                    isPro() ? "bg-gradient-to-r from-secondary to-secondary-dim text-surface" : "bg-gradient-to-r from-primary to-primary-dim text-surface"
                                )}>
                                {subscription?.plan ? `${subscription.plan} plan` : 'Free plan'}
                                </span>
                                {isPro() && subscription?.polar_subscription_id && (
                                    <button 
                                        onClick={handleCancelSubscription}
                                        className="text-xs font-black uppercase tracking-widest text-error hover:text-error/70 transition-colors underline underline-offset-4 ml-2"
                                    >
                                        Cancel
                                    </button>
                                )}
                                {!isPro() && (
                                    <button 
                                        onClick={handleUpgrade}
                                        className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors underline underline-offset-4"
                                    >
                                        Go Premium
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="z-10 w-full sm:w-auto mt-4 sm:mt-0">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsProfileModalOpen(true)}
                                className="w-full bg-surface-container-lowest border border-outline-variant/20 hover:bg-surface-container/20 text-on-surface font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-colors shadow-sm text-[10px]"
                            >
                                Edit profile
                            </motion.button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
                    </AnimatedCard>


                    {/* Removed Linked accounts section per user request */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-5 border-b border-outline-variant/5 flex items-center gap-3 shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">tune</span></div>
                                <h3 className="font-bold text-on-surface font-headline uppercase tracking-widest text-sm">App settings</h3>
                            </div>
                            <div className="divide-y divide-outline-variant/5 flex-1">
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Dark mode</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 italic">Switch between light and dark themes.</p>
                                    </div>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className={clsx(
                                            "w-11 h-6 rounded-full transition-all relative",
                                            darkMode ? "bg-primary shadow-lg shadow-primary/20" : "bg-surface-container"
                                        )}
                                    >
                                        <div className={clsx(
                                            "absolute top-1 w-4 h-4 rounded-full transition-all",
                                            darkMode ? "left-6 bg-surface shadow-sm" : "left-1 bg-on-surface-variant/30"
                                        )}></div>
                                    </button>
                                </div>
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Currency</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 italic">Choose your local currency.</p>
                                    </div>
                                    <select
                                        value={currency}
                                        onChange={handleCurrencyChange}
                                        className="bg-surface-container-lowest border border-outline-variant/10 text-on-surface text-xs font-black uppercase tracking-widest rounded-lg focus:ring-1 focus:ring-primary focus:border-primary block p-2 outline-none appearance-none cursor-pointer hover:border-primary/30 transition-colors"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-5 border-b border-outline-variant/5 flex items-center gap-3 shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">notifications</span></div>
                                <h3 className="font-bold text-on-surface font-headline uppercase tracking-widest text-sm">Notifications</h3>
                            </div>
                            <div className="divide-y divide-outline-variant/5 flex-1">
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Large spends</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 italic">Get notified for big expenses.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-lg shadow-primary/20">
                                        <div className="w-4 h-4 bg-surface rounded-full absolute top-1 right-1 shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Weekly report</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 italic">A summary of your week.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-lg shadow-primary/20">
                                        <div className="w-4 h-4 bg-surface rounded-full absolute top-1 right-1 shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button onClick={handleSignOut} className="w-full bg-surface-container-lowest border border-error/10 text-error hover:bg-error/5 hover:border-error/20 font-black uppercase tracking-widest px-4 py-3 rounded-2xl transition-all shadow-sm text-xs flex items-center justify-center gap-2">
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
