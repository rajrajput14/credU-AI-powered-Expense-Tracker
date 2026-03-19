import { create } from 'zustand'

export const useCurrencyStore = create((set, get) => ({
    baseCurrency: 'INR',
    selectedCurrency: { code: 'INR', symbol: '₹' },
    rates: { INR: 1 }, 
    ratesLoading: false,

    setSelectedCurrency: (code, symbol) => set({ selectedCurrency: { code, symbol } }),

    fetchRates: async () => {
        const { baseCurrency } = get()
        set({ ratesLoading: true })
        try {
            const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`)
            const data = await response.json()
            if (data && data.rates) {
                set({ rates: data.rates, ratesLoading: false })
            } else {
                set({ ratesLoading: false })
            }
        } catch (err) {
            console.error('Failed to fetch exchange rates:', err)
            set({ ratesLoading: false })
        }
    }
}))
