import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import SkeletonTableRow from '../components/skeletons/SkeletonTableRow';
import PageTransition from '../components/animations/PageTransition';
import { useAppStore } from '../store/useAppStore';

const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
        case 'groceries': case 'food': return { icon: 'shopping_bag', color: 'primary' };
        case 'salary': case 'income': return { icon: 'work', color: 'secondary' };
        case 'entertainment': case 'subscriptions': return { icon: 'movie', color: 'tertiary' };
        case 'dining': return { icon: 'local_cafe', color: 'primary' };
        case 'transport': return { icon: 'directions_car', color: 'secondary' };
        default: return { icon: 'receipt_long', color: 'on-surface-variant' };
    }
};

const Transactions = () => {
    const { transactions, setTransactionModal, user, loading } = useAppStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [timelinePeriod, setTimelinePeriod] = useState('This Month');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const categories = useMemo(() => {
        const cats = new Set(transactions.map(t => t.category));
        return ["All", ...Array.from(cats)].filter(Boolean);
    }, [transactions]);

    const filteredByPeriod = useMemo(() => {
        const now = new Date();
        return transactions.filter(tx => {
            const txDate = new Date(tx.date);
            if (timelinePeriod === 'This Month') {
                return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
            }
            if (timelinePeriod === 'This Week') {
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return txDate >= oneWeekAgo;
            }
            if (timelinePeriod === 'Last 3 Months') {
                const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                return txDate >= threeMonthsAgo;
            }
            return true; // All Time
        });
    }, [transactions, timelinePeriod]);

    const handleExport = () => {
        const headers = ['Date', 'Name', 'Category', 'Amount', 'Type', 'Status'];
        const rows = transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.name,
            t.category,
            t.amount,
            t.type,
            t.status
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredTransactions = useMemo(() => {
        return filteredByPeriod.filter(tx => {
            // Status filter
            if (filter === 'Completed' && tx.status !== 'completed') return false;
            if (filter === 'Pending' && tx.status !== 'pending') return false;
            if (filter === 'Income' && tx.type !== 'income') return false;
            if (filter === 'Expenses' && tx.type !== 'expense') return false;

            // Category filter
            if (categoryFilter !== 'All' && tx.category !== categoryFilter) return false;

            // Search filter
            if (searchTerm) {
                const query = searchTerm.toLowerCase();
                if (!tx.note?.toLowerCase().includes(query) && 
                    !tx.category?.toLowerCase().includes(query) &&
                    !tx.name?.toLowerCase().includes(query)) {
                    return false;
                }
            }
            return true;
        });
    }, [filteredByPeriod, filter, searchTerm, categoryFilter]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const pendingCount = transactions.filter(t => t.status === 'pending').length;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusBadge = (status) => {
        if (status === 'pending') {
            return (
                <span className="text-[10px] font-black uppercase tracking-widest text-tertiary bg-tertiary/10 px-2 py-1 rounded-md flex items-center gap-1 w-fit">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> Pending
                </span>
            );
        }
        return (
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-1 rounded-md">Completed</span>
        );
    };

    return (
        <div className="flex-1 flex flex-col w-full font-body">
            <header className="h-16 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10 flex items-center justify-between px-8 shrink-0 z-10 w-full lg:flex hidden">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-on-surface-variant hover:text-on-surface cursor-pointer font-medium transition-colors">App</span>
                    <span className="text-on-surface-variant/40">/</span>
                    <span className="text-on-surface font-black">Expenses</span>
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
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface mb-1 font-headline">Past transactions</h1>
                        <p className="text-on-surface-variant text-sm font-medium">Review your recent activity.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative group flex-1 md:flex-initial">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">search</span>
                            <input 
                                type="text" 
                                placeholder="Search expenses..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/10 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all w-full md:w-64 shadow-sm placeholder:text-on-surface-variant/40 font-bold" 
                            />
                        </div>
                        <div className="relative">
                            <button 
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={clsx(
                                    "flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all shadow-sm text-sm font-bold",
                                    categoryFilter !== 'All' ? "bg-primary/10 border-primary/20 text-primary" : "bg-surface-container-lowest border-outline-variant/10 text-on-surface-variant hover:bg-surface-container"
                                )}
                            >
                                <span className={clsx("material-symbols-outlined text-[18px]", categoryFilter !== 'All' ? "text-primary" : "text-on-surface-variant/60")}>filter_list</span>
                                <span className="hidden sm:inline">{categoryFilter === 'All' ? 'Filters' : categoryFilter}</span>
                            </button>

                            {isFilterOpen && (
                                <>
                                    <div className="fixed inset-0 z-20" onClick={() => setIsFilterOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-xl z-30 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest border-b border-outline-variant/5 mb-1">Filter by Category</div>
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setCategoryFilter(cat);
                                                    setIsFilterOpen(false);
                                                    setCurrentPage(1);
                                                }}
                                                className={clsx(
                                                    "w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between font-bold",
                                                    categoryFilter === cat ? "bg-primary/5 text-primary" : "text-on-surface-variant hover:bg-surface-container"
                                                )}
                                            >
                                                <span className="capitalize">{cat}</span>
                                                {categoryFilter === cat && <span className="material-symbols-outlined text-sm">check</span>}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <button 
                            onClick={handleExport}
                            className="flex items-center justify-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/10 hover:bg-surface-container transition-all shadow-sm text-sm font-bold text-on-surface-variant hidden sm:flex shrink-0"
                        >
                            <span className="material-symbols-outlined text-[18px]">download</span> Download list
                        </button>
                    </div>
                </div>

                {/* Timeline Slider (Period Filter) */}
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden mb-8">
                    <div className="flex items-center gap-6 px-4 md:px-6 border-b border-outline-variant/5 bg-surface-container/30 overflow-x-auto no-scrollbar">
                        {['This Month', 'This Week', 'Last 3 Months', 'All Time'].map((period) => (
                            <button 
                                key={period}
                                onClick={() => { setTimelinePeriod(period); setCurrentPage(1); }}
                                className={clsx(
                                    "py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors flex items-center gap-1",
                                    timelinePeriod === period 
                                        ? "text-primary border-b-2 border-primary" 
                                        : "text-on-surface-variant hover:text-on-surface"
                                )}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-6 px-4 md:px-6 border-b border-outline-variant/5 bg-surface-container/30 overflow-x-auto no-scrollbar">
                        {['All', 'Income', 'Expenses', 'Pending'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => { setFilter(tab); setCurrentPage(1); }}
                                className={clsx(
                                    "py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors flex items-center gap-1",
                                    filter === tab 
                                        ? "text-primary border-b-2 border-primary" 
                                        : "text-on-surface-variant hover:text-on-surface"
                                )}
                            >
                                {tab === 'All' ? 'Everything' : tab}
                                {tab === 'Pending' && pendingCount > 0 && (
                                    <span className="bg-surface-container text-on-surface/60 text-[10px] px-1.5 py-0.5 rounded-md ml-1">{pendingCount}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-surface-container-lowest border-b border-outline-variant/5 text-[10px] uppercase tracking-widest text-on-surface-variant/40 font-black">
                                    <th className="py-3 px-6">Item</th>
                                    <th className="py-3 px-6">Category</th>
                                    <th className="py-3 px-6 hidden sm:table-cell">Date</th>
                                    <th className="py-3 px-6 hidden md:table-cell">Status</th>
                                    <th className="py-3 px-6 text-right">Amount</th>
                                    <th className="py-3 px-4 text-center w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/5 text-sm">
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <SkeletonTableRow key={i} />
                                    ))
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {paginatedTransactions.map((tx, index) => {
                                            const { icon, color } = getCategoryIcon(tx.category || tx.name);
                                            const isIncome = tx.type === 'income';

                                            return (
                                                <motion.tr 
                                                    key={tx.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                                    className="hover:bg-surface-container/40 transition-colors group"
                                                >
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className={clsx(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-outline-variant/5",
                                                                color === 'primary' ? "bg-primary/10 text-primary" : 
                                                                color === 'secondary' ? "bg-secondary/10 text-secondary" :
                                                                color === 'tertiary' ? "bg-tertiary/10 text-tertiary" :
                                                                "bg-surface-container text-on-surface-variant"
                                                            )}>
                                                                <span className="material-symbols-outlined text-[20px]">{icon}</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-on-surface group-hover:text-primary transition-colors font-headline">
                                                                    {tx.name || tx.note || 'Transaction'}
                                                                </p>
                                                                <p className="text-[10px] text-on-surface-variant/60 font-black uppercase tracking-widest sm:hidden">{formatDate(tx.date)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={clsx(
                                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border",
                                                            color === 'primary' ? "bg-primary/5 text-primary border-primary/10" : 
                                                            color === 'secondary' ? "bg-secondary/5 text-secondary border-secondary/10" :
                                                            color === 'tertiary' ? "bg-tertiary/5 text-tertiary border-tertiary/10" :
                                                            "bg-surface-container text-on-surface-variant border-outline-variant/10"
                                                        )}>
                                                            <span className={clsx(
                                                                "w-1.5 h-1.5 rounded-full",
                                                                color === 'primary' ? "bg-primary" : 
                                                                color === 'secondary' ? "bg-secondary" :
                                                                color === 'tertiary' ? "bg-tertiary" :
                                                                "bg-on-surface-variant/40"
                                                            )}></span> {tx.category || 'General'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-on-surface-variant font-bold text-xs uppercase tracking-widest hidden sm:table-cell">{formatDate(tx.date)}</td>
                                                    <td className="py-4 px-6 hidden md:table-cell">
                                                        {getStatusBadge(tx.status)}
                                                    </td>
                                                    <td className={clsx(
                                                        "py-4 px-6 text-right font-bold font-headline text-lg",
                                                        isIncome ? "text-secondary" : "text-on-surface"
                                                    )}>
                                                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <motion.button 
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setTransactionModal(true, tx)}
                                                            className="text-on-surface-variant/40 hover:text-on-surface transition-colors opacity-0 md:group-hover:opacity-100"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                                        </motion.button>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                )}

                                {!loading && paginatedTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-on-surface-variant/60 font-bold italic">
                                            Couldn't find any expenses matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 border-t border-outline-variant/5 flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                        <span className="text-on-surface-variant/60">
                            Showing <span className="text-on-surface">{Math.min(filteredTransactions.length, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="text-on-surface">{Math.min(filteredTransactions.length, currentPage * itemsPerPage)}</span> of <span className="text-on-surface">{filteredTransactions.length}</span> results
                        </span>
                        
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/10 text-on-surface-variant/40 hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            
                            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={clsx(
                                        "w-8 h-8 flex items-center justify-center rounded-lg transition-all",
                                        currentPage === i + 1 
                                            ? "bg-primary text-surface shadow-lg shadow-primary/20" 
                                            : "hover:bg-surface-container text-on-surface-variant"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/10 text-on-surface-variant/40 hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
