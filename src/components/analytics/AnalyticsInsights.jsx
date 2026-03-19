import { generateInsights } from '../../utils/analyticsUtils'
import { Sparkles, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import clsx from 'clsx'

const AnalyticsInsights = ({ transactions }) => {
    const insights = generateInsights(transactions)

    if (insights.length === 0) return null

    const getIcon = (type) => {
        if (type === 'success') return <CheckCircle size={20} />
        if (type === 'danger') return <AlertCircle size={20} />
        if (type === 'warning') return <TrendingUp size={20} />
        return <Sparkles size={20} />
    }

    const getColor = (type) => {
        if (type === 'success') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        if (type === 'danger') return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
        if (type === 'warning') return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        return 'bg-indigo-500/10 text-primary border-indigo-500/20'
    }

    return (
        <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm h-full flex flex-col">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-primary">
                    <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold text-on-surface">Smart Insights</h3>
            </div>
            <div className="space-y-4 flex-1">
                {insights.map(insight => (
                    <div key={insight.id} className="group flex gap-4 rounded-2xl bg-surface border border-outline-variant p-5 transition-all hover:border-primary/50">
                        <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border", getColor(insight.type))}>
                            {getIcon(insight.type)}
                        </div>
                        <div>
                            <p className="font-bold text-on-surface">{insight.title}</p>
                            <p className="text-sm text-on-surface-variant">{insight.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AnalyticsInsights
