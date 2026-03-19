import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import clsx from 'clsx'
import { useTransactionStore } from '../store/useTransactionStore'

const Dashboard = () => {
    const { transactions, loading } = useTransactionStore()

    const statsData = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0)
        
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0)
        
        const balance = income - expenses

        return {
            balance: `$${balance.toLocaleString()}`,
            income: `$${income.toLocaleString()}`,
            expenses: `$${expenses.toLocaleString()}`
        }
    }, [transactions])

    const stats = [
        { label: 'Total Balance', value: statsData.balance, icon: DollarSign, trend: '+2.4%', color: 'bg-indigo-500/10 text-indigo-500' },
        { label: 'Income', value: statsData.income, icon: TrendingUp, trend: '+12%', color: 'bg-emerald-500/10 text-emerald-500' },
        { label: 'Expenses', value: statsData.expenses, icon: TrendingDown, trend: '-5%', color: 'bg-rose-500/10 text-rose-500' }
    ]

    const chartOption = useMemo(() => {
        // Simple grouping by month for the line chart
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date()
            d.setMonth(d.getMonth() - (5 - i))
            return d.toLocaleString('default', { month: 'short' })
        })

        const dataByMonth = last6Months.map(month => {
            return transactions
                .filter(t => new Date(t.date).toLocaleString('default', { month: 'short' }) === month)
                .reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0)
        })

        return {
            backgroundColor: 'transparent',
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'category',
                data: last6Months,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#94A3B8' }
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { color: '#1E293B' } },
                axisLabel: { color: '#94A3B8' }
            },
            series: [{
                data: dataByMonth,
                type: 'line',
                smooth: true,
                lineStyle: { color: '#6366F1', width: 4 },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [{ offset: 0, color: 'rgba(99, 102, 241, 0.3)' }, { offset: 1, color: 'rgba(99, 102, 241, 0)' }]
                    }
                },
                symbol: 'none'
            }],
            tooltip: { trigger: 'axis', backgroundColor: '#121826', borderColor: '#1E293B', textStyle: { color: '#fff' } }
        }
    }, [transactions])

    if (loading && transactions.length === 0) {
        return <div className="p-10 text-center text-slate-500">Loading your financial data...</div>
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        whileHover={{ y: -5 }}
                        className="rounded-3xl border border-voxa-border bg-voxa-card p-8 shadow-sm"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-voxa-muted">{stat.label}</span>
                            <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl", stat.color)}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-voxa-text">{stat.value}</h2>
                        <div className="mt-4 flex items-center gap-2">
                             <span className={clsx("text-xs font-semibold", stat.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
                                {stat.trend}
                             </span>
                             <span className="text-xs text-voxa-muted">vs last month</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="rounded-3xl border border-voxa-border bg-voxa-card p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-voxa-text">Performance Tracking</h3>
                        <p className="text-sm text-voxa-muted">Monthly net flow analysis</p>
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
