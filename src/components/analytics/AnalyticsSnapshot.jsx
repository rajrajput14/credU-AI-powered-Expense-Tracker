import { useMemo } from 'react'
import Icon from '../Icon'
import clsx from 'clsx'
import { useCurrencyStore } from '../../store/useCurrencyStore'
import { convertAmount, formatCurrency } from '../../utils/currencyUtils'

const AnalyticsSnapshot = ({ transactions }) => {
    const { selectedCurrency, rates, baseCurrency } = useCurrencyStore()

    const stats = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
        const savings = income - expenses
        
        // Simple Financial Score Calculation
        let score = 50
        if (income > 0) {
            const ratio = expenses / income
            score = ratio < 0.5 ? 95 : ratio < 0.8 ? 80 : ratio <= 1 ? 60 : 35
        } else if (expenses > 0 && income === 0) {
            score = 30
        } else if (expenses === 0 && income === 0) {
            score = 0 // No data yet
        }

        const expensesFormatted = convertAmount(expenses, rates, baseCurrency, selectedCurrency.code)
        const savingsFormatted = convertAmount(savings, rates, baseCurrency, selectedCurrency.code)

        return [
            { id: '1', label: 'Total Spending', value: formatCurrency(expensesFormatted, selectedCurrency.symbol), icon: 'dollar', color: 'bg-rose-500/10 text-rose-500' },
            { id: '2', label: 'Net Savings', value: formatCurrency(savingsFormatted, selectedCurrency.symbol), icon: 'savings', color: savings >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500' },
            { id: '3', label: 'Financial Score', value: `${score}/100`, icon: 'score', color: score >= 70 ? 'bg-indigo-500/10 text-indigo-500' : score >= 50 ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500' },
        ]
    }, [transactions, rates, baseCurrency, selectedCurrency])

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
            {stats.map(s => (
                <div key={s.id} className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">{s.label}</span>
                        <div className={clsx("h-10 w-10 flex items-center justify-center rounded-xl", s.color)}>
                        <Icon name={s.icon} size="md" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-on-surface">{s.value}</h2>
                </div>
            ))}
        </div>
    )
}

export default AnalyticsSnapshot
