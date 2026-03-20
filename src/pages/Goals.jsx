import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import SkeletonCard from '../components/skeletons/SkeletonCard';
import AnimatedCard from '../components/animations/AnimatedCard';
import PageTransition from '../components/animations/PageTransition';

const Goals = () => {
    const { goals, setGoalModal, setFundGoalModal, user, loading } = useAppStore();
    const [filter, setFilter] = useState('All');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    const totalSaved = useMemo(() => 
        goals.reduce((sum, g) => sum + Number(g.current_amount || 0), 0)
    , [goals]);

    const activeGoals = useMemo(() => 
        goals.filter(g => (g.current_amount || 0) < (g.target_amount || 1))
    , [goals]);

    const completedGoals = useMemo(() => 
        goals.filter(g => (g.current_amount || 0) >= (g.target_amount || 1))
    , [goals]);

    const completedThisYear = completedGoals.filter(g => {
        if (!g.created_at) return false;
        return new Date(g.created_at).getFullYear() === new Date().getFullYear();
    }).length;

    const getGoalIcon = (title) => {
        const t = title?.toLowerCase() || '';
        if (t.includes('trip') || t.includes('travel') || t.includes('vacation')) return { emoji: '✈️', color: 'primary' };
        if (t.includes('mac') || t.includes('laptop') || t.includes('pc') || t.includes('tech')) return { emoji: '💻', color: 'secondary' };
        if (t.includes('car') || t.includes('auto') || t.includes('vehicle')) return { emoji: '🚗', color: 'tertiary' };
        if (t.includes('house') || t.includes('home') || t.includes('apartment') || t.includes('deposit')) return { emoji: '🏠', color: 'primary' };
        if (t.includes('wedding') || t.includes('ring')) return { emoji: '💍', color: 'tertiary' };
        return { emoji: '🎯', color: 'primary' };
    };

    const projectedNextMonth = useMemo(() => {
        const savedThisMonth = goals.reduce((sum, g) => sum + (g.current_amount || 0), 0);
        return (savedThisMonth / 12) * 1.1;
    }, [goals]);

    const formatDate = (dateString) => {
        if (!dateString) return 'No date set';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="flex-1 flex flex-col w-full font-body">
            <header className="h-16 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10 flex items-center justify-between px-8 shrink-0 z-10 w-full lg:flex hidden">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-on-surface-variant hover:text-on-surface cursor-pointer font-medium transition-colors">App</span>
                    <span className="text-on-surface-variant/40">/</span>
                    <span className="text-on-surface font-black">Savings Goals</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="material-symbols-outlined text-on-surface-variant/60 hover:text-on-surface transition-colors">notifications</button>
                    <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant/10 overflow-hidden cursor-pointer">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'Felix'}&backgroundColor=e2e8f0`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface mb-1 font-headline">Your savings goals</h1>
                        <p className="text-on-surface-variant text-sm font-medium">Keep track of what you're saving for.</p>
                    </div>
                    
                    <button 
                        onClick={() => setGoalModal(true)}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-surface px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 w-full md:w-auto"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Add a goal
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    ) : (
                        <>
                            <AnimatedCard delay={0.1} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm flex items-center gap-4 hover:border-primary/20 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined">track_changes</span>
                                </div>
                                <div>
                                    <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mb-0.5">Total saved</p>
                                    <h3 className="font-bold text-xl text-on-surface font-headline">{formatCurrency(totalSaved)}</h3>
                                </div>
                            </AnimatedCard>
                            <AnimatedCard delay={0.2} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm flex items-center gap-4 hover:border-secondary/20 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined">auto_graph</span>
                                </div>
                                <div>
                                    <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mb-0.5">Estimated savings</p>
                                    <h3 className="font-bold text-xl text-on-surface font-headline">+{formatCurrency(projectedNextMonth)}</h3>
                                </div>
                            </AnimatedCard>
                            <AnimatedCard delay={0.3} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm flex items-center gap-4 hover:border-tertiary/20 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined">emoji_events</span>
                                </div>
                                <div>
                                    <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mb-0.5">Goals reached</p>
                                    <h3 className="font-bold text-xl text-on-surface font-headline">{completedGoals.length} <span className="text-sm font-medium text-on-surface-variant/40 italic">({completedThisYear} this year)</span></h3>
                                </div>
                            </AnimatedCard>
                        </>
                    )}
                </div>

                <h2 className="text-lg font-bold text-on-surface tracking-tight mt-10 mb-4 font-headline uppercase tracking-widest">Still saving</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-0">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    ) : (
                        activeGoals.map((goal, index) => {
                            const progress = Math.min(((goal.current_amount || 0) / (goal.target_amount || 1)) * 100, 100);
                            const { emoji, color } = getGoalIcon(goal.title);
                            
                            let statusText = "On Track";
                            let statusIcon = "auto_awesome";
                            
                            if (progress < 20) {
                                statusText = "Just Started";
                                statusIcon = "rocket_launch";
                            } else if (progress > 80) {
                                statusText = "Almost There!";
                                statusIcon = "celebration";
                            }

                            return (
                                <AnimatedCard delay={0.4 + (index * 0.1)} key={goal.id} className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
                                        <span className={clsx("px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest", 
                                            color === 'primary' ? "bg-primary/10 text-primary" : 
                                            color === 'secondary' ? "bg-secondary/10 text-secondary" :
                                            "bg-tertiary/10 text-tertiary"
                                        )}>
                                            {progress.toFixed(0)}%
                                        </span>
                                        <button 
                                            onClick={() => setGoalModal(true, goal)}
                                            className="text-on-surface-variant/30 hover:text-on-surface opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                    
                                    <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-outline-variant/5 shadow-inner", 
                                        color === 'primary' ? "bg-primary/5" : 
                                        color === 'secondary' ? "bg-secondary/5" :
                                        "bg-tertiary/5"
                                    )}>
                                        <span className="text-2xl">{emoji}</span>
                                    </div>
                                    
                                    <h3 className="font-bold text-on-surface text-lg mb-1 font-headline">{goal.title}</h3>
                                    <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mb-6 italic opacity-60">Target: {formatDate(goal.deadline)}</p>
                                    
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                                            <span className={clsx(
                                                color === 'primary' ? "text-primary" : 
                                                color === 'secondary' ? "text-secondary" :
                                                "text-tertiary"
                                            )}>{formatCurrency(goal.current_amount)}</span>
                                            <span className="text-on-surface-variant/40">of {formatCurrency(goal.target_amount)}</span>
                                        </div>
                                        <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 1.5, delay: 0.6 + (index * 0.1), ease: "easeOut" }}
                                                className={clsx("h-full rounded-full transition-all duration-1000", 
                                                    color === 'primary' ? "bg-primary" : 
                                                    color === 'secondary' ? "bg-secondary" :
                                                    "bg-tertiary"
                                                )} 
                                            ></motion.div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
                                        <p className={clsx("text-[10px] font-black uppercase tracking-widest flex items-center gap-1", 
                                            color === 'primary' ? "text-primary" : 
                                            color === 'secondary' ? "text-secondary" :
                                            "text-tertiary"
                                        )}>
                                            <span className="material-symbols-outlined text-[14px]">{statusIcon}</span> {statusText}
                                        </p>
                                        <button 
                                            onClick={() => setFundGoalModal(true, goal)}
                                            className={clsx("text-xs font-black uppercase tracking-widest hover:opacity-70 transition-opacity underline underline-offset-4", 
                                                color === 'primary' ? "text-primary" : 
                                                color === 'secondary' ? "text-secondary" :
                                                "text-tertiary"
                                            )}
                                        >
                                            Add money
                                        </button>
                                    </div>
                                </AnimatedCard>
                            );
                        })
                    )}

                    {!loading && activeGoals.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-surface-container/20 rounded-3xl border border-dashed border-outline-variant/20">
                            <span className="material-symbols-outlined text-on-surface-variant/20 text-5xl mb-3">flag</span>
                            <h3 className="text-lg font-bold text-on-surface-variant/40 uppercase tracking-widest font-headline">No goals yet</h3>
                            <p className="text-on-surface-variant/30 text-xs font-bold uppercase tracking-widest">Create your first goal to start tracking progress.</p>
                        </div>
                    )}
                </div>

                <h2 className="text-lg font-bold text-on-surface tracking-tight mt-12 mb-4 font-headline uppercase tracking-widest opacity-60">Reached</h2>
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden mb-8">
                    {completedGoals.map((goal, i) => {
                        const { emoji } = getGoalIcon(goal.title);
                        return (
                            <div key={goal.id} className={clsx(
                                "p-4 flex items-center justify-between hover:bg-surface-container/30 cursor-pointer transition-colors group",
                                i > 0 && "border-t border-outline-variant/5"
                            )}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{emoji}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-on-surface-variant/40 line-through group-hover:text-on-surface transition-colors font-headline">{goal.title}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30">Reached on {formatDate(goal.deadline)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-on-surface font-headline">{formatCurrency(goal.target_amount)}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-1 justify-end"><span className="material-symbols-outlined text-[14px]">check_circle</span> Done</p>
                                </div>
                            </div>
                        );
                    })}

                    {completedGoals.length === 0 && (
                        <div className="p-8 text-center bg-surface-container/10">
                            <p className="text-on-surface-variant/30 font-black uppercase tracking-widest text-[10px]">No goals reached yet. You can do it!</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Goals;
