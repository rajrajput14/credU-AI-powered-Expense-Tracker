import { useMemo } from 'react'
import { Store, TrendingDown } from 'lucide-react'
import { useCurrencyStore } from '../../store/useCurrencyStore'
import { convertAmount, formatCurrency } from '../../utils/currencyUtils'

const MerchantList = ({ transactions }) => {
    const { selectedCurrency, rates, baseCurrency } = useCurrencyStore()

    const merchants = useMemo(() => {
        const groups = transactions
            .filter(t => t.type === 'expense' && t.note)
            .reduce((acc, t) => {
                const name = t.note.trim()
                acc[name] = (acc[name] || 0) + Number(t.amount)
                return acc
            }, {})
        
        return Object.entries(groups)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, amount]) => ({ name, amount }))
    }, [transactions])

    if (merchants.length === 0) return null

    return (
        <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <Store size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-on-surface">Top Merchants</h3>
                    <p className="text-sm font-medium text-on-surface-variant mt-1">Places where you spend the most</p>
                </div>
            </div>
            <div className="space-y-4">
                {merchants.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-outline-variant transition-colors hover:border-outline-variant/80">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-on-surface-variant">#{i + 1}</span>
                            <span className="font-semibold text-on-surface truncate max-w-[150px]">{m.name}</span>
                        </div>
                        <span className="font-bold text-rose-500 flex items-center gap-1">
                            <TrendingDown size={14} />
                            {formatCurrency(convertAmount(m.amount, rates, baseCurrency, selectedCurrency.code), selectedCurrency.symbol)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MerchantList
