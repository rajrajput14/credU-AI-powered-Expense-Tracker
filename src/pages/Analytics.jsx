import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { analyticsService } from '../services/analyticsService';
import SkeletonCard from '../components/skeletons/SkeletonCard';
import SkeletonChart from '../components/skeletons/SkeletonChart';
import AnimatedCard from '../components/animations/AnimatedCard';
import PageTransition from '../components/animations/PageTransition';

const Analytics = () => {
    const { user, subscription, transactions, budget, loading, isPro, setPaywallOpen, formatCurrency, getCurrencySymbol } = useAppStore();
    const [period, setPeriod] = useState('All Time');

    const filteredByPeriod = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        return transactions.filter(t => {
            const d = new Date(t.date);
            if (period === 'This Month') return d >= startOfMonth;
            if (period === 'This Year') return d >= startOfYear;
            return true;
        });
    }, [transactions, period]);

    const { totalIncome, monthlySpending: totalExpenses } = useMemo(() => 
        analyticsService.computeDashboardMetrics(filteredByPeriod), 
    [filteredByPeriod]);

    const cashFlow = useMemo(() => 
        analyticsService.computeCashFlow(filteredByPeriod), 
    [filteredByPeriod]);

    const activeInsight = useMemo(() => 
        analyticsService.generateInsight(filteredByPeriod, budget), 
    [filteredByPeriod, budget]);

    const categoryBreakdown = useMemo(() => 
        analyticsService.computeCategoryBreakdown(filteredByPeriod), 
    [filteredByPeriod]);

    const topCategories = categoryBreakdown.slice(0, 4);
    const colorPalette = ['orange', 'blue', 'purple', 'emerald', 'rose'];

    const pieGradient = useMemo(() => {
        let currentP = 0;
        const colors = ['#f97316', '#3b82f6', '#a855f7', '#10b981'];
        if (topCategories.length === 0) return 'transparent';
        
        const stops = topCategories.map((cat, i) => {
            const start = currentP;
            currentP += cat.percentage;
            return `${colors[i % colors.length]} ${start}% ${currentP}%`;
        });
        return `conic-gradient(${stops.join(', ')})`;
    }, [topCategories]);

    const cashFlowPoints = useMemo(() => {
        const max = Math.max(...cashFlow.map(d => Math.max(d.income, d.expense)), 1);
        const incomePath = cashFlow.map((d, i) => `${i * 20},${100 - (d.income / max * 80)}`).join(' L ');
        const expensePath = cashFlow.map((d, i) => `${i * 20},${100 - (d.expense / max * 80)}`).join(' L ');
        return { incomePath, expensePath };
    }, [cashFlow]);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    // Quick heuristic for "Fixed Bills" - housing, rent, utilities, subscriptions
    const fixedBills = filteredByPeriod
        .filter(t => t.type === 'expense' && ['housing', 'rent', 'utilities', 'subscriptions', 'bills'].includes(t.category?.toLowerCase()))
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);


    return (
        <div className="flex-1 flex flex-col w-full font-body">
            <header className="h-16 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10 flex items-center justify-between px-8 shrink-0 z-10 w-full lg:flex hidden">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-on-surface-variant hover:text-on-surface cursor-pointer font-medium transition-colors">App</span>
                    <span className="text-on-surface-variant/40">/</span>
                    <span className="text-on-surface font-black">Insights</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <button className="material-symbols-outlined text-on-surface-variant/60 hover:text-on-surface transition-colors">notifications</button>
                    <Link to="/app-dashboard/settings" className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant/10 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.user_metadata?.avatar_seed || user?.email || 'Felix'}&backgroundColor=e2e8f0`} alt="Profile" className="w-full h-full object-cover" />
                    </Link>
                </div>
            </header>

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface mb-1 font-headline">Insights</h1>
                        <p className="text-on-surface-variant text-sm font-medium">See where your money is going.</p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/10 shadow-sm">
                        {['All Time', 'This Month', 'This Year'].map(p => (
                            <button 
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={clsx(
                                    "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                                    period === p ? "bg-primary/10 text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    ) : (
                        <>
                            <AnimatedCard delay={0.1} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors"><span className="material-symbols-outlined">shopping_bag</span></div>
                                </div>
                                <div>
                                    <p className="text-on-surface-variant text-sm font-bold mb-1 uppercase tracking-widest text-[10px]">Total spent</p>
                                    <h3 className="text-2xl font-bold text-on-surface tracking-tight font-headline">{formatCurrency(totalExpenses)}</h3>
                                </div>
                            </AnimatedCard>
                            <AnimatedCard delay={0.2} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col justify-between hover:border-secondary/30 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary/20 transition-colors"><span className="material-symbols-outlined">payments</span></div>
                                </div>
                                <div>
                                    <p className="text-on-surface-variant text-sm font-bold mb-1 uppercase tracking-widest text-[10px]">Total income</p>
                                    <h3 className="text-2xl font-bold text-on-surface tracking-tight font-headline">{formatCurrency(totalIncome)}</h3>
                                </div>
                            </AnimatedCard>
                            <AnimatedCard delay={0.3} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col justify-between hover:border-tertiary/30 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:bg-tertiary/20 transition-colors"><span className="material-symbols-outlined">savings</span></div>
                                </div>
                                <div>
                                    <p className="text-on-surface-variant text-sm font-bold mb-1 uppercase tracking-widest text-[10px]">Savings rate</p>
                                    <h3 className="text-2xl font-bold text-on-surface tracking-tight font-headline">{savingsRate.toFixed(1)}%</h3>
                                </div>
                            </AnimatedCard>
                            <AnimatedCard delay={0.4} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors"><span className="material-symbols-outlined">receipt_long</span></div>
                                </div>
                                <div>
                                    <p className="text-on-surface-variant text-sm font-bold mb-1 uppercase tracking-widest text-[10px]">Regular bills</p>
                                    <h3 className="text-2xl font-bold text-on-surface tracking-tight font-headline">{formatCurrency(fixedBills)}</h3>
                                </div>
                            </AnimatedCard>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Cash Flow Chart */}
                    {loading ? (
                        <div className="lg:col-span-2">
                            <SkeletonChart />
                        </div>
                    ) : !isPro() ? (
                        <AnimatedCard delay={0.5} className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm lg:col-span-2 flex flex-col relative overflow-hidden group">
                            <div className="absolute inset-0 bg-surface/40 backdrop-blur-[4px] z-20 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4"><span className="material-symbols-outlined text-[28px]">lock</span></div>
                                <h4 className="font-bold text-on-surface text-lg mb-2 font-headline">Advanced Cash Flow</h4>
                                <p className="text-on-surface-variant text-sm mb-6 max-w-xs">Pro users get detailed daily balance tracking and income vs expense trends.</p>
                                <button 
                                    onClick={() => setPaywallOpen(true)}
                                    className="px-6 py-2.5 bg-primary text-surface rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                >
                                    Upgrade to Pro
                                </button>
                            </div>
                            <div className="opacity-20 pointer-events-none filter blur-[2px]">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="font-bold text-on-surface tracking-tight text-lg mb-1 font-headline">Money in vs out</h3>
                                </div>
                                <div className="h-64 bg-surface-container rounded-xl"></div>
                            </div>
                        </AnimatedCard>
                    ) : (
                        <AnimatedCard delay={0.5} className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm lg:col-span-2 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-on-surface tracking-tight text-lg mb-1 font-headline">Money in vs out</h3>
                                    <p className="text-on-surface-variant text-sm font-medium">See your balance over time</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-secondary"></span><span className="text-on-surface-variant">Income</span></div>
                                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-on-surface"></span><span className="text-on-surface-variant">Expenses</span></div>
                                </div>
                            </div>
                            
                            <div className="flex-1 w-full min-h-[300px] flex items-end gap-2 sm:gap-6 relative text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">
                                <div className="flex flex-col justify-between h-full py-2 pr-2 col-span-1 absolute left-0 top-0 bottom-6 text-right w-10">
                                    <span>$8k</span><span>$6k</span><span>$4k</span><span>$2k</span><span>0</span>
                                </div>
                                
                                <div className="ml-10 flex-1 h-full relative border-b border-outline-variant/10 pb-2 flex items-end justify-between">
                                    <svg className="absolute inset-x-0 bottom-2 w-full h-[80%] overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                        <motion.path 
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                                            d={`M ${cashFlowPoints.expensePath}`} 
                                            fill="none" 
                                            stroke="var(--on-surface)" 
                                            strokeWidth="3" 
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="transition-all duration-700"
                                        ></motion.path>
                                        <defs>
                                            <linearGradient id="incomeGrad" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.2"></stop>
                                                <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        <motion.path 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 1, delay: 1.5 }}
                                            d={`M ${cashFlowPoints.incomePath} L 100,100 L 0,100 Z`} 
                                            fill="url(#incomeGrad)"
                                            className="transition-all duration-700"
                                        ></motion.path>
                                        <motion.path 
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                                            d={`M ${cashFlowPoints.incomePath}`} 
                                            fill="none" 
                                            stroke="var(--secondary)" 
                                            strokeWidth="3" 
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="transition-all duration-700"
                                        ></motion.path>
                                    </svg>
                                    
                                    {cashFlow.map((d, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1 w-full text-[10px] font-bold">
                                            <span>{d.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AnimatedCard>
                    )}

                    {/* Expense Breakdown */}
                    {loading ? (
                        <div className="flex flex-col gap-4">
                            <SkeletonCard />
                        </div>
                    ) : (
                        <AnimatedCard delay={0.6} className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm flex flex-col">
                            <div className="mb-8">
                                <h3 className="font-bold text-on-surface tracking-tight text-lg mb-1 font-headline">Where your money went</h3>
                                <p className="text-on-surface-variant text-sm font-medium">Spending by category</p>
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-center items-center">
                                <div className="relative w-48 h-48 rounded-full border-[16px] border-surface-container flex items-center justify-center mb-8 shadow-inner">
                                    <motion.div 
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        transition={{ duration: 1.5, delay: 1 }}
                                        className="absolute inset-[-16px] rounded-full transition-all duration-1000" 
                                        style={{ background: pieGradient, WebkitMaskImage: 'radial-gradient(transparent 58%, black 60%)', maskImage: 'radial-gradient(transparent 58%, black 60%)' }}
                                    ></motion.div>
                                    
                                    <div className="text-center bg-surface-container-lowest rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-sm relative z-10">
                                        <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Total</p>
                                        <p className="text-xl font-bold text-on-surface truncate px-2 font-headline">{formatCurrency(totalExpenses)}</p>
                                    </div>
                                </div>

                                <div className="w-full space-y-3">
                                    {topCategories.map((cat, i) => (
                                        <div key={cat.category} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)' }}></div>
                                                <span className="font-bold text-on-surface-variant capitalize">{cat.category}</span>
                                            </div>
                                            <span className="font-bold text-on-surface">{cat.percentage.toFixed(0)}%</span>
                                        </div>
                                    ))}
                                    {topCategories.length === 0 && (
                                        <p className="text-on-surface-variant text-center italic mt-4 text-sm font-medium">No transactions yet.</p>
                                    )}
                                </div>
                            </div>
                        </AnimatedCard>
                    )}
                </div>

                {/* Smart Insights & Anomalies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {!isPro() ? (
                        <div className="bg-surface-container rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-outline-variant/10 relative overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4"><span className="material-symbols-outlined">auto_awesome</span></div>
                            <h4 className="font-bold text-on-surface mb-2 font-headline">AI Wealth Insights</h4>
                            <p className="text-on-surface-variant text-xs mb-4">Get personalized advice on how to save more money every month.</p>
                            <button 
                                onClick={() => setPaywallOpen(true)}
                                className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-secondary/70 transition-colors underline underline-offset-4"
                            >
                                Unlock with Pro
                            </button>
                        </div>
                    ) : (
                        <div className="bg-on-surface rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
                                    <span className="material-symbols-outlined text-primary">psychology</span>
                                </div>
                                <h3 className="font-bold text-lg tracking-tight font-headline">What we noticed</h3>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md relative z-10">
                                <p className="text-sm leading-relaxed text-white/90">
                                    {activeInsight}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
                        <h3 className="font-bold text-on-surface tracking-tight text-lg mb-6 font-headline">Top categories</h3>
                        
                        <div className="space-y-5">
                            {topCategories.map((cat, i) => (
                                <div key={cat.category}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-on-surface-variant capitalize">{cat.category}</span>
                                        <span className="font-bold text-on-surface">{formatCurrency(cat.amount)}</span>
                                    </div>
                                    <div className="w-full bg-surface-container rounded-full h-2">
                                        <div className="h-2 rounded-full fluid-gradient transition-all duration-1000" style={{ width: `${cat.percentage}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            {topCategories.length === 0 && (
                                <p className="text-on-surface-variant text-center italic mt-4 text-sm font-medium">No transactions yet.</p>
                            )}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
