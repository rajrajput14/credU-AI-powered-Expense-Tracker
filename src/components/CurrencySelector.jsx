import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useAppStore } from '../store/useAppStore'
import Icon from './Icon'

const CurrencySelector = () => {
    const { currency, setCurrency, availableCurrencies } = useAppStore()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const selectedCurrency = availableCurrencies.find(c => c.code === currency) || availableCurrencies[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (curr) => {
        setCurrency(curr.code)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-xl border border-outline-variant/10 bg-surface-container-lowest/50 backdrop-blur-md px-3 py-2 text-[10px] font-black uppercase tracking-widest text-on-surface hover:bg-surface-container/20 transition-all border-outline-variant/5 shadow-sm"
            >
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                    {selectedCurrency.symbol}
                </span>
                <span>{selectedCurrency.code}</span>
                <ChevronDown size={14} className={clsx("text-on-surface-variant/40 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-lowest/90 backdrop-blur-xl shadow-2xl z-50 p-1"
                    >
                        {availableCurrencies.map(curr => (
                            <button
                                key={curr.code}
                                onClick={() => handleSelect(curr)}
                                className={clsx(
                                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                    selectedCurrency.code === curr.code 
                                        ? "bg-primary/10 text-primary" 
                                        : "text-on-surface-variant/60 hover:bg-surface-container/50 hover:text-on-surface"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={clsx("flex h-6 w-6 items-center justify-center rounded-md font-bold transition-colors",
                                        selectedCurrency.code === curr.code ? "bg-primary/20" : "bg-on-surface/5"
                                    )}>
                                        {curr.symbol}
                                    </span>
                                    <span>{curr.code}</span>
                                </div>
                                {selectedCurrency.code === curr.code && <Icon name="success" size="sm" className="text-primary" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CurrencySelector
