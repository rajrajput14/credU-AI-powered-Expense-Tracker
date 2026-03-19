import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { PieChart, Sparkles, TrendingUp, Wallet } from 'lucide-react'
import { useTransactionStore } from '../store/useTransactionStore'
import { useTheme } from '../context/ThemeContext'
import clsx from 'clsx'

const Analytics = () => {
    const { transactions, loading } = useTransactionStore()
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const pieOption = useMemo(() => {
        const categories = {}
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categories[t.category] = (categories[t.category] || 0) + Number(t.amount)
            })
        
        const data = Object.entries(categories).map(([name, value]) => ({
            name,
            value
        }))

        return {
            backgroundColor: 'transparent',
            tooltip: { 
                trigger: 'item', 
                backgroundColor: isDark ? '#121826' : '#fff', 
                borderColor: isDark ? '#1E293B' : '#E5E7EB', 
                textStyle: { color: isDark ? '#fff' : '#111827' } 
            },
            legend: { 
                bottom: '0%', 
                left: 'center', 
                textStyle: { color: isDark ? '#94A3B8' : '#6B7280' } 
            },
            series: [
                {
                    name: 'Spending',
                    type: 'pie',
                    radius: ['45%', '75%'],
                    center: ['50%', '45%'],
                    avoidLabelOverlap: true,
                    itemStyle: {
                        borderRadius: 12,
                        borderColor: isDark ? '#121826' : '#fff',
                        borderWidth: 2
                    },
                    label: { show: false },
                    emphasis: {
                        label: { 
                            show: true, 
                            fontSize: 16, 
                            fontWeight: 'bold', 
                            color: isDark ? '#fff' : '#111827' 
                        }
                    },
                    data: data.length > 0 ? data : [{ value: 0, name: 'No data' }]
                }
            ],
            color: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']
        }
    }, [transactions, isDark])

    if (loading && transactions.length === 0) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-voxa-primary border-t-transparent" />
                <p className="text-voxa-muted font-medium">Analyzing your finances...</p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-voxa-border bg-voxa-card p-8 shadow-sm"
                >
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-voxa-primary">
                                <PieChart size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-voxa-text">Spending Split</h3>
                        </div>
                        <span className="text-xs font-bold text-voxa-muted uppercase tracking-widest">30 Day View</span>
                    </div>
                    
                    <div className="h-[400px] w-full">
                        {transactions.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center gap-3 text-voxa-muted italic">
                                <Wallet size={48} className="opacity-20" />
                                <p>Add transactions to view charts</p>
                            </div>
                        ) : (
                            <ReactECharts option={pieOption} style={{ height: '100%', width: '100%' }} />
                        )}
                    </div>
                </motion.div>

                <div className="space-y-8">
                    {/* Insights Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl border border-voxa-border bg-voxa-card p-8 shadow-sm"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-voxa-text">Voxa Insights</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {transactions.length > 0 ? (
                                <>
                                    <div className="group flex gap-4 rounded-2xl bg-voxa-bg border border-voxa-border p-5 hover:border-voxa-primary transition-all">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-voxa-primary">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-voxa-text">Activity Detected</p>
                                            <p className="text-sm text-voxa-muted">You've recorded {transactions.length} transactions this period.</p>
                                        </div>
                                    </div>
                                    <div className="group flex gap-4 rounded-2xl bg-voxa-bg border border-voxa-border p-5 hover:border-voxa-primary transition-all">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                                            <Sparkles size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-voxa-text">Top Spending</p>
                                            <p className="text-sm text-voxa-muted">Your highest expense category is <span className="text-voxa-text font-bold">{pieOption.series[0].data[0]?.name || 'Unknown'}</span>.</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-10 text-center">
                                    <p className="text-sm text-voxa-muted italic">Add transactions to unlock AI-powered insights.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Pro Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white shadow-xl shadow-indigo-500/20"
                    >
                        <div className="relative z-10">
                            <h3 className="mb-2 text-2xl font-black italic tracking-tight">VOXA AI PRO</h3>
                            <p className="mb-6 max-w-[200px] text-sm font-medium text-white/80">Get hyper-personalized financial advice and predictive budgeting.</p>
                            <button className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-indigo-600 shadow-lg active:scale-95 transition-all">
                                Unlock AI Insights
                            </button>
                        </div>
                        {/* Decorative blobs */}
                        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-indigo-400/20 blur-2xl" />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Analytics
