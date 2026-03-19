export const generateInsights = (transactions) => {
    if (!transactions || transactions.length === 0) return []

    const insights = []
    
    // 1. Top Category
    const categoryTotals = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
            return acc
        }, {})

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
    const topCategory = sortedCategories[0]

    if (topCategory && topCategory[1] > 0) {
        insights.push({
            id: 'top_category',
            title: 'Top Category Priority',
            description: `You've spent the most on ${topCategory[0]} ($${topCategory[1].toLocaleString()}) this period.`,
            type: 'warning'
        })
    }

    // 2. Largest Single Expense
    const expenses = transactions.filter(t => t.type === 'expense')
    if (expenses.length > 0) {
        const maxExpense = [...expenses].sort((a, b) => Number(b.amount) - Number(a.amount))[0]
        insights.push({
            id: 'largest_expense',
            title: 'Largest Single Expense',
            description: `A ${maxExpense.category} expense of $${Number(maxExpense.amount).toLocaleString()} was your biggest transaction.`,
            type: 'alert'
        })
    }

    // 3. Savings / Deficit
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
    const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0)
    
    if (income > 0) {
        const saved = income - totalExpenses
        if (saved > 0) {
            insights.push({
                id: 'savings_positive',
                title: 'Positive Cashflow',
                description: `You are saving $${saved.toLocaleString()} compared to your incoming cash.`,
                type: 'success'
            })
        } else {
            insights.push({
                id: 'savings_negative',
                title: 'Spending Exceeds Income',
                description: `You've spent $${Math.abs(saved).toLocaleString()} more than your income.`,
                type: 'danger'
            })
        }
    }

    return insights.slice(0, 3)
}
