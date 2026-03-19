import { useEffect, useState, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useCurrencyStore } from '../store/useCurrencyStore'
import Icon from './Icon'

const AVAILABLE_CURRENCIES = [
    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
    { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
    { code: 'JPY', symbol: '¥', label: 'Japanese Yen' }
]

const CurrencySelector = () => {
    const { selectedCurrency, setSelectedCurrency, fetchRates, ratesLoading } = useCurrencyStore()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        fetchRates()
    }, [fetchRates])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (currency) => {
        setSelectedCurrency(currency.code, currency.symbol)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-xl border border-voxa-border bg-voxa-bg px-3 py-2 text-sm font-bold text-voxa-text hover:bg-white/5 transition-colors"
            >
                {ratesLoading ? (
                    <Icon name="loading" size="sm" className="animate-spin text-voxa-muted" />
                ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-voxa-primary/20 text-voxa-primary">
                        {selectedCurrency.symbol}
                    </span>
                )}
                <span>{selectedCurrency.code}</span>
                <ChevronDown size={14} className={clsx("text-voxa-muted transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-voxa-border bg-voxa-card shadow-2xl z-50 p-1"
                    >
                        {AVAILABLE_CURRENCIES.map(curr => (
                            <button
                                key={curr.code}
                                onClick={() => handleSelect(curr)}
                                className={clsx(
                                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                                    selectedCurrency.code === curr.code 
                                        ? "bg-indigo-500/10 text-voxa-primary" 
                                        : "text-voxa-muted hover:bg-voxa-bg hover:text-voxa-text"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 font-bold text-voxa-text">
                                        {curr.symbol}
                                    </span>
                                    <span>{curr.code}</span>
                                </div>
                                {selectedCurrency.code === curr.code && <Icon name="success" size="sm" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CurrencySelector
