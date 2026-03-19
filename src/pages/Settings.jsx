import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAppStore } from '../store/useAppStore';
import clsx from 'clsx';
import ProfileEditModal from '../components/ProfileEditModal';

const Settings = () => {
    const navigate = useNavigate();
    const { user, currency, setCurrency, darkMode, setDarkMode } = useAppStore();
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
                    <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant/10 overflow-hidden cursor-pointer">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'Felix'}&backgroundColor=e2e8f0`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto w-full">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold tracking-tight text-on-surface mb-1 font-headline">Intelligence & Settings</h1>
                    <p className="text-on-surface-variant text-sm font-medium">Manage your account preferences and app configurations.</p>
                </div>

                <div className="space-y-6 pb-12 z-0">

                    <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
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
                                <span className="bg-gradient-to-r from-primary to-primary-dim text-surface text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Basic Tier</span>
                                <button className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors underline underline-offset-4">Upgrade</button>
                            </div>
                        </div>
                        <div className="z-10 w-full sm:w-auto mt-4 sm:mt-0">
                            <button
                                onClick={() => setIsProfileModalOpen(true)}
                                className="w-full bg-surface-container-lowest border border-outline-variant/20 hover:bg-surface-container/20 text-on-surface font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-colors shadow-sm text-[10px]"
                            >
                                Edit Profile
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-outline-variant/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">account_balance</span></div>
                            <h3 className="font-bold text-on-surface font-headline uppercase tracking-widest text-sm">Connected Institutions</h3>
                        </div>
                        <div className="divide-y divide-outline-variant/5">
                            <div className="p-6 flex items-center justify-between hover:bg-surface-container/10 transition-colors cursor-not-allowed opacity-40">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-on-surface text-surface flex items-center justify-center font-bold text-xl shadow-sm font-headline">P</div>
                                    <div>
                                        <p className="font-bold text-on-surface mb-0.5 font-headline">Plaid Integration</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 flex items-center gap-1 italic">
                                            Phase 2 Release
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30 hidden sm:inline">Disconnected</span>
                                    <button className="text-on-surface-variant/20 hover:text-on-surface transition-colors disabled"><span className="material-symbols-outlined">more_vert</span></button>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-surface-container/10 border-t border-outline-variant/5">
                            <button onClick={handleLinkAccount} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"><span className="material-symbols-outlined text-[18px]">add</span> Link New Account</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-5 border-b border-outline-variant/5 flex items-center gap-3 shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">tune</span></div>
                                <h3 className="font-bold text-on-surface font-headline uppercase tracking-widest text-sm">Preferences</h3>
                            </div>
                            <div className="divide-y divide-outline-variant/5 flex-1">
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Interface Mode</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 italic">Dynamic dark mode adaptation.</p>
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
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Currency Standard</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 italic">Global capital formatting.</p>
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
                                <h3 className="font-bold text-on-surface font-headline uppercase tracking-widest text-sm">Signals</h3>
                            </div>
                            <div className="divide-y divide-outline-variant/5 flex-1">
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Outlier Spending</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 italic">Alerts for spends over $500.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-lg shadow-primary/20">
                                        <div className="w-4 h-4 bg-surface rounded-full absolute top-1 right-1 shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-on-surface text-sm mb-1 font-headline">Alpha Summary</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 italic">Weekly financial digest.</p>
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
                            <span className="material-symbols-outlined text-[18px]">logout</span> De-authenticate Session
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
