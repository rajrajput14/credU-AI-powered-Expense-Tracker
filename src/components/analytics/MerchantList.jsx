import { useMemo } from 'react'
import { Store, TrendingDown } from 'lucide-react'

const MerchantList = ({ transactions }) => {
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
        <div className="rounded-3xl border border-voxa-border bg-voxa-card p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <Store size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-voxa-text">Top Merchants</h3>
                    <p className="text-sm font-medium text-voxa-muted mt-1">Places where you spend the most</p>
                </div>
            </div>
            <div className="space-y-4">
                {merchants.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-voxa-bg border border-voxa-border transition-colors hover:border-voxa-border/80">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-voxa-muted">#{i + 1}</span>
                            <span className="font-semibold text-voxa-text truncate max-w-[150px]">{m.name}</span>
                        </div>
                        <span className="font-bold text-rose-500 flex items-center gap-1">
                            <TrendingDown size={14} />
                            ${m.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MerchantList
