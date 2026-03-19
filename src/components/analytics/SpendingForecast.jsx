import { useMemo } from 'react'
import { Clock, TrendingUp } from 'lucide-react'

const SpendingForecast = ({ transactions }) => {
    const forecast = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense')
        if (expenses.length === 0) return null

        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        
        let daysElapsed = new Date().getDate()
        daysElapsed = Math.max(1, daysElapsed)

        const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
        const remainingDays = Math.max(0, totalDaysInMonth - daysElapsed)

        const currentSpend = expenses
            .filter(t => {
                const d = new Date(t.date)
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear
            })
            .reduce((sum, t) => sum + Number(t.amount), 0)

        if (currentSpend === 0) return null

        const avgDaily = currentSpend / daysElapsed
        const projectedTotal = currentSpend + (avgDaily * remainingDays)

        return {
            avgDaily,
            projectedTotal,
            remainingDays,
            daysElapsed
        }
    }, [transactions])

    if (!forecast) return null

    return (
        <div className="rounded-3xl border border-voxa-border bg-voxa-card p-8 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Clock size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-voxa-text">End of Month Forecast</h3>
                    <p className="text-sm font-medium text-voxa-muted mt-1">Based on {forecast.daysElapsed} days of data</p>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="flex justify-between items-center rounded-2xl bg-voxa-bg border border-voxa-border p-4">
                    <span className="text-sm font-bold text-voxa-muted uppercase tracking-widest">Daily Burn Rate</span>
                    <span className="font-bold text-voxa-text">${forecast.avgDaily.toLocaleString(undefined, {maximumFractionDigits: 0})} / day</span>
                </div>
                
                <div>
                    <span className="text-xs font-bold text-voxa-muted uppercase tracking-widest block mb-2">Projected Total Spend</span>
                    <div className="flex items-center gap-3">
                        <TrendingUp size={28} className="text-voxa-primary" />
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-voxa-primary to-voxa-secondary tracking-tight">
                            ${forecast.projectedTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpendingForecast
