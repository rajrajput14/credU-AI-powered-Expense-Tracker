export const analyticsService = {
  computeDashboardMetrics: (transactions = []) => {
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      
    return {
      totalBalance: income,
      monthlySpending: expenses,
      totalIncome: income,
    };
  },

  computeSummary: (transactions = []) => {
    const metrics = analyticsService.computeDashboardMetrics(transactions);
    return {
      ...metrics,
      budget: 2000, // Default budget for now
      savings: metrics.totalIncome - metrics.monthlySpending
    };
  },

  computeCategoryBreakdown: (transactions = []) => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const breakdown = expenses.reduce((acc, t) => {
      const cat = t.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + Number(t.amount || 0);
      return acc;
    }, {});
    
    const totalSelected = expenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    
    return Object.entries(breakdown)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSelected > 0 ? (amount / totalSelected) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  },

  computeSpendingTrend: (transactions = []) => {
    const weeks = [0, 0, 0, 0]; // Last 4 weeks
    const now = new Date();
    
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const d = new Date(t.date);
      const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);
      if (weekIndex >= 0 && weekIndex < 4) {
        weeks[3 - weekIndex] += Number(t.amount || 0);
      }
    });
    
    const max = Math.max(...weeks, 1);
    return weeks.map(val => (val / max) * 100);
  },

  computeCashFlow: (transactions = []) => {
    const months = Array(6).fill(0).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return { 
        name: d.toLocaleDateString('en-US', { month: 'short' }),
        income: 0,
        expense: 0,
        month: d.getMonth(),
        year: d.getFullYear()
      };
    });

    transactions.forEach(t => {
      const d = new Date(t.date);
      const m = d.getMonth();
      const y = d.getFullYear();
      const idx = months.findIndex(mo => mo.month === m && mo.year === y);
      if (idx !== -1) {
        if (t.type === 'income') months[idx].income += Number(t.amount || 0);
        else months[idx].expense += Number(t.amount || 0);
      }
    });

    return months;
  },

  generateInsight: (transactions = [], budget = 4000) => {
    const recent = transactions.filter(t => {
      const d = new Date(t.date);
      const diff = (new Date() - d) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });

    const categories = recent.reduce((acc, t) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount || 0);
      }
      return acc;
    }, {});

    const top = Object.entries(categories).sort((a,b) => b[1] - a[1])[0];
    
    if (!top) return "You haven't recorded any expenses this week. Keep tracking to get AI insights!";
    
    const [cat, amt] = top;
    const percent = Math.round((amt / budget) * 100);

    if (percent > 20) {
      return `You've spent $${Math.round(amt)} on ${cat} this week. This is ${percent}% of your budget. Consider scaling back to stay on track.`;
    } else {
      return `Great job! Your ${cat} spending is only ${percent}% of your budget. You're well within your limits.`;
    }
  }
};
