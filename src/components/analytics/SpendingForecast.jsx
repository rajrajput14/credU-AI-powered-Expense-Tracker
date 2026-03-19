import { useMemo } from 'react'
import Icon from '../Icon'

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
        <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Icon name="clock" size="lg" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-on-surface">End of Month Forecast</h3>
                    <p className="text-sm font-medium text-on-surface-variant mt-1">Based on {forecast.daysElapsed} days of data</p>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="flex justify-between items-center rounded-2xl bg-surface border border-outline-variant p-4">
                    <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Daily Burn Rate</span>
                    <span className="font-bold text-on-surface">${forecast.avgDaily.toLocaleString(undefined, {maximumFractionDigits: 0})} / day</span>
                </div>
                
                <div>
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Projected Total Spend</span>
                    <div className="flex items-center gap-3">
                        <Icon name="forecast" size="lg" className="text-primary" />
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-tight">
                            ${forecast.projectedTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpendingForecast
