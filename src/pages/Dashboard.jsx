import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { analyticsService } from '../services/analyticsService';
import { useMemo } from 'react';
import clsx from 'clsx';

const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
        case 'food': case 'dining': return { icon: 'restaurant', color: 'orange' };
        case 'income': case 'salary': return { icon: 'payments', color: 'emerald' };
        case 'transport': case 'travel': return { icon: 'directions_car', color: 'blue' };
        case 'entertainment': case 'subscriptions': return { icon: 'subscriptions', color: 'purple' };
        default: return { icon: 'receipt_long', color: 'gray' };
    }
};

const Dashboard = () => {
    const { user, transactions, goals, budget, setTransactionModal } = useAppStore();
    const { totalBalance, monthlySpending } = useMemo(() => 
        analyticsService.computeDashboardMetrics(transactions), 
    [transactions]);

    const spendingTrend = useMemo(() => 
        analyticsService.computeSpendingTrend(transactions), 
    [transactions]);

    const aiInsight = useMemo(() => 
        analyticsService.generateInsight(transactions, budget), 
    [transactions, budget]);

    const savings = useMemo(() => 
        goals.reduce((sum, g) => sum + (g.current_amount || 0), 0),
    [goals]);

    const metrics = { totalBalance, monthlySpending, budget, savings };

    const recentTransactions = transactions.slice(0, 4);
    const activeGoals = goals.slice(0, 2);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 w-full font-body"> 
            {/* Greeting Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-on-surface-variant font-medium mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">wb_twilight</span>
                        Good Morning,
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-on-surface font-headline">
                        {user?.email?.split('@')[0] || 'User'}
                    </h1>
                </div>
                
                {/* Date Selector */}
                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-2 rounded-xl border border-outline-variant/10 shadow-sm">
                    <button className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
                    <span className="text-sm font-semibold text-on-surface px-2 min-w-[100px] text-center">
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Balance Card */}
                <div className="fluid-gradient rounded-3xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white/70 font-medium text-sm mb-1 uppercase tracking-wider">Total Balance</p>
                                <h2 className="text-4xl font-bold tracking-tight font-headline">{formatCurrency(totalBalance)}</h2>
                            </div>
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                <span className="material-symbols-outlined text-white">account_balance_wallet</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center text-on-secondary-container bg-secondary-container/20 px-2 py-1 rounded-lg text-xs font-bold">
                                <span className="material-symbols-outlined text-[14px] leading-none">trending_up</span>
                                +2.4%
                            </span>
                            <span className="text-white/60 text-xs text-sm">vs last month</span>
                        </div>
                    </div>
                </div>

                {/* Monthly Spending Card */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm flex flex-col justify-between gap-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-on-surface-variant font-medium text-sm mb-1 uppercase tracking-wider">Monthly Spending</p>
                            <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">{formatCurrency(monthlySpending)}</h2>
                        </div>
                        <div className="w-10 h-10 bg-error/10 text-error rounded-full flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined">credit_card</span>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-on-surface-variant">Budget Limit</span>
                            <span className="text-on-surface font-bold">{formatCurrency(budget)}</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                            <div className="bg-primary h-2 rounded-full relative transition-all duration-1000" style={{ width: `${Math.min((monthlySpending / budget) * 100, 100)}%` }}>
                                <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>
                        <p className="text-xs text-on-surface-variant text-right"><span className="text-primary font-bold text-xs">{Math.min(Math.round((monthlySpending / budget) * 100), 100)}%</span> used</p>
                    </div>
                </div>

                {/* AI Insights Card */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 shadow-sm flex flex-col relative overflow-hidden glass-card">
                    <div className="absolute -bottom-6 -right-6 text-primary/10">
                        <span className="material-symbols-outlined text-[120px]">auto_awesome</span>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full fluid-gradient flex items-center justify-center shadow-md">
                                <span className="material-symbols-outlined text-white text-sm">auto_awesome</span>
                            </div>
                            <h3 className="font-bold text-on-surface tracking-tight font-headline">AI Insights</h3>
                        </div>
                        
                        <p className="text-on-surface-variant text-sm leading-relaxed font-medium mb-4 italic">
                            "{aiInsight}"
                        </p>
                        
                        <button className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors flex items-center w-fit gap-1">
                            View Details <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content 2 Col Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Col: Charts & Transactions */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Spending Trend Line Chart Placeholder */}
                    <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-on-surface tracking-tight text-lg font-headline">Spending Trend</h3>
                            <button className="p-2 hover:bg-surface-container rounded-xl text-on-surface-variant transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                        
                        <div className="h-64 w-full flex items-end gap-2 text-xs text-on-surface-variant relative">
                            {/* Y Axis */}
                            <div className="flex flex-col justify-between h-full py-4 pr-2 text-right absolute left-0 top-0 bottom-8">
                                <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0</span>
                            </div>
                            
                            {/* Bars */}
                            <div className="ml-10 w-full h-[200px] flex items-end justify-between gap-1 sm:gap-4 relative pb-2 border-b border-outline-variant/10">
                                {spendingTrend.map((percent, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 group w-full h-full justify-end">
                                        <div 
                                            className={clsx(
                                                "w-full transition-all duration-500 rounded-t-sm relative",
                                                i === 3 ? "fluid-gradient shadow-md shadow-primary/20" : "bg-primary/10 group-hover:bg-primary/20"
                                            )}
                                            style={{ height: `${percent}%` }}
                                        >
                                            {i === 3 && percent > 0 && (
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap">Current</div>
                                            )}
                                        </div>
                                        <span className={clsx("text-[10px] sm:text-xs", i === 3 && "text-primary font-bold")}>W{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-on-surface tracking-tight text-lg font-headline">Recent Transactions</h3>
                            <Link to="/app-dashboard/transactions" className="text-sm font-semibold text-primary hover:text-primary transition-colors">View All</Link>
                        </div>
                        
                        <div className="space-y-4">
                            {recentTransactions.map((tx) => {
                                const { icon, color } = getCategoryIcon(tx.category || tx.name);
                                const isIncome = tx.type === 'income';
                                
                                return (
                                    <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-surface-container rounded-2xl transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-surface-container text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                <span className="material-symbols-outlined">{icon}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-on-surface group-hover:text-primary transition-colors">
                                                    {tx.note || tx.category || 'Transaction'}
                                                </p>
                                                <p className="text-xs text-on-surface-variant font-medium tracking-wide">
                                                    {tx.category || 'General'} • {formatDate(tx.date)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={clsx("font-bold", isIncome ? "text-secondary font-bold" : "text-on-surface font-bold")}>
                                                {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {recentTransactions.length === 0 && (
                                <p className="text-on-surface-variant text-sm italic text-center py-4 font-medium">No recent transactions yet.</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Col: Goals & Quick Actions */}
                <div className="space-y-8">
                    
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setTransactionModal(true)}
                            className="flex justify-center items-center gap-2 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/10 p-4 rounded-2xl shadow-sm transition-all focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                <span className="material-symbols-outlined text-[20px]">send</span>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-on-surface">Transfer</p>
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Quick Send</p>
                            </div>
                        </button>
                        <button 
                            onClick={() => setTransactionModal(true)}
                            className="flex justify-center items-center gap-2 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/10 p-4 rounded-2xl shadow-sm transition-all focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-on-surface">Pay Bills</p>
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Monthly</p>
                            </div>
                        </button>
                    </div>

                    {/* Active Goals */}
                    <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="font-bold text-on-surface tracking-tight text-lg font-headline">Active Goals</h3>
                            <Link to="/app-dashboard/goals" className="text-on-surface-variant hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">add_circle</span>
                            </Link>
                        </div>

                        {activeGoals.map((goal, index) => {
                            const progress = Math.min(((goal.current_amount || 0) / (goal.target_amount || 1)) * 100, 100);
                            const bgGradient = index % 2 === 0 
                                ? "fluid-gradient" 
                                : "bg-gradient-to-r from-secondary to-secondary-container";
                            const iconBg = index % 2 === 0 ? "bg-primary/10" : "bg-secondary/10";
                            
                            return (
                                <div key={goal.id} className="mb-6 relative z-10">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center text-lg`}>
                                                {goal.title?.includes('Europe') ? '✈️' : '🎯'}
                                            </div>
                                            <span className="font-bold text-on-surface text-sm">{goal.title}</span>
                                        </div>
                                        <span className="text-xs font-bold text-on-surface">
                                            {formatCurrency(goal.current_amount)} / <span className="text-on-surface-variant font-medium">{formatCurrency(goal.target_amount)}</span>
                                        </span>
                                    </div>
                                    <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                                        <div className={`${bgGradient} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}

                        {activeGoals.length === 0 && (
                            <p className="text-on-surface-variant text-sm italic text-center py-4 relative z-10 font-medium">No active goals found.</p>
                        )}
                        
                        {/* Decorative bg element */}
                        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[100px] text-primary/5 -rotate-12 select-none">flag</span>
                    </div>
                    
                    {/* Custom Promo Banner */}
                    <div className="rounded-3xl p-6 bg-on-surface text-white shadow-lg relative overflow-hidden flex flex-col items-center text-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/20">
                            <span className="material-symbols-outlined text-tertiary">workspace_premium</span>
                        </div>
                        <h4 className="font-bold text-lg mb-1 tracking-tight font-headline">Upgrade to Premium</h4>
                        <p className="text-white/70 text-sm mb-4">Get advanced AI analytics and unlimited goals.</p>
                        <button className="bg-white text-on-surface hover:bg-white/90 font-bold px-4 py-2 rounded-xl text-sm transition-all w-full shadow-sm active:scale-95">View Plans</button>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Dashboard;
