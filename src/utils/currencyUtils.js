export const convertAmount = (amount, rates, baseCurrencyCode, targetCurrencyCode) => {
    if (baseCurrencyCode === targetCurrencyCode) return Number(amount)
    
    if (!rates || !rates[targetCurrencyCode]) return Number(amount)

    const converted = Number(amount) * rates[targetCurrencyCode]
    return converted
}

export const formatCurrency = (amount, symbol) => {
    return `${symbol}${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const formatCurrencyCompact = (amount, symbol) => {
    return `${symbol}${Number(amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}
