import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../components/Icon'
import clsx from 'clsx'
import { useTransactionStore } from '../store/useTransactionStore'
import { supabase } from '../services/supabase'
import { useCurrencyStore } from '../store/useCurrencyStore'
import { convertAmount, formatCurrency } from '../utils/currencyUtils'

const Transactions = () => {
    const { transactions, loading, deleteTransaction, addTransaction, voiceEntry, clearVoiceEntry } = useTransactionStore()
    const { selectedCurrency, rates, baseCurrency } = useCurrencyStore()
    const [showAddForm, setShowAddForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    
    // Form state
    const [amount, setAmount] = useState('')
    const [type, setType] = useState('expense')
    const [category, setCategory] = useState('food')
    const [note, setNote] = useState('')

    // Handle voice bridge
    useEffect(() => {
        if (voiceEntry) {
            setAmount(voiceEntry.amount?.toString() || '')
            setType(voiceEntry.type || 'expense')
            setCategory(voiceEntry.category || 'other')
            setNote(voiceEntry.note || '')
            setShowAddForm(true)
            // We clear it after populating so it doesn't stay stuck
            clearVoiceEntry()
        }
    }, [voiceEntry, clearVoiceEntry])

    const handleManualSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSuccess(false)
        
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No user found")

            await addTransaction(user.id, {
                amount: parseFloat(amount),
                type,
                category,
                note,
                date: new Date().toISOString()
            })
            
            setSuccess(true)
            setAmount('')
            setNote('')
            setTimeout(() => {
                setSuccess(false)
                setShowAddForm(false)
            }, 1500)
        } catch (error) {
            console.error(error)
            alert("Failed to add transaction")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading && transactions.length === 0) {
        return <div className="p-10 text-center text-slate-500">Loading transactions...</div>
    }

    return (
        <div className="space-y-6 font-inter">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Icon name="search" size="sm" className="absolute left-4 top-1/2 -translate-y-1/2 text-voxa-muted" />
                    <input 
                        type="text" 
                        placeholder="Search transactions..." 
                        className="w-full rounded-2xl border border-voxa-border bg-voxa-card py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-voxa-primary/50 text-voxa-text"
                    />
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowAddForm(!showAddForm)}
                        className={clsx(
                            "flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all",
                            showAddForm ? "bg-rose-500/10 text-rose-500" : "bg-voxa-primary text-white shadow-lg hover:opacity-90 active:scale-95"
                        )}
                    >
                        <Icon name={showAddForm ? 'close' : 'add'} size="sm" />
                        {showAddForm ? 'Cancel' : 'Add Entry'}
                    </button>
                    <button className="flex items-center gap-2 rounded-2xl border border-voxa-border bg-voxa-card px-6 py-3 text-sm font-bold text-voxa-muted hover:text-voxa-text">
                        <Icon name="filter" size="sm" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="rounded-3xl border border-voxa-border bg-voxa-card p-6 shadow-xl">
                            <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-voxa-muted block mb-1">Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full rounded-xl border border-voxa-border bg-voxa-bg p-3 text-voxa-text outline-none focus:border-voxa-primary transition-colors"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-voxa-muted block mb-1">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full rounded-xl border border-voxa-border bg-voxa-bg p-3 text-voxa-text outline-none focus:border-voxa-primary transition-colors"
                                    >
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-voxa-muted block mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full rounded-xl border border-voxa-border bg-voxa-bg p-3 text-voxa-text outline-none focus:border-voxa-primary transition-colors"
                                    >
                                        {['shopping', 'food', 'transport', 'bills', 'entertainment', 'income', 'other'].map(cat => (
                                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-voxa-muted block mb-1">Note / Description</label>
                                    <input
                                        type="text"
                                        required
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full rounded-xl border border-voxa-border bg-voxa-bg p-3 text-voxa-text outline-none focus:border-voxa-primary transition-colors"
                                        placeholder="e.g. Lunch at Joe's"
                                    />
                                </div>
                                <div className="md:col-span-4 mt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-voxa-primary to-voxa-secondary py-3.5 font-bold shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 text-white"
                                    >
                                        {isSubmitting ? <Icon name="loading" className="animate-spin" /> : success ? <Icon name="success" /> : <Icon name="add" />}
                                        {success ? "Added Successfully!" : "Confirm Entry"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="rounded-3xl border border-voxa-border bg-voxa-card overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="border-b border-voxa-border bg-white/5 uppercase text-[10px] font-bold tracking-widest text-voxa-muted">
                        <tr>
                            <th className="px-8 py-4">Transaction</th>
                            <th className="px-8 py-4">Category</th>
                            <th className="px-8 py-4">Date</th>
                            <th className="px-8 py-4 text-right">Amount</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-voxa-border">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center text-voxa-muted italic">No transactions found. Try adding one via voice!</td>
                            </tr>
                        ) : transactions.map((t, i) => (
                            <motion.tr 
                                key={t.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="hover:bg-white/5"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "flex h-10 w-10 items-center justify-center rounded-xl",
                                            t.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                        )}>
                                            <Icon name={t.type === 'income' ? 'arrowUpRight' : 'arrowDownLeft'} size="sm" active />
                                        </div>
                                        <span className="font-bold text-voxa-text">{t.note || 'Untitled Transaction'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-voxa-bg px-3 py-1 text-xs font-medium text-voxa-muted border border-voxa-border transition-colors group-hover:border-voxa-border/80">
                                        <Icon name={t.category} size="sm" className="text-voxa-primary opacity-80" />
                                        {t.category.charAt(0).toUpperCase() + t.category.slice(1)}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-sm text-voxa-muted">
                                    {new Date(t.date).toLocaleDateString()}
                                </td>
                                <td className={clsx(
                                    "px-8 py-6 text-right font-bold text-lg",
                                    t.type === 'income' ? "text-emerald-500" : "text-voxa-text"
                                )}>
                                    {t.type === 'income' ? '+' : '-'}
                                    {formatCurrency(convertAmount(t.amount, rates, baseCurrency, selectedCurrency.code), selectedCurrency.symbol)}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button 
                                        onClick={() => deleteTransaction(t.id)}
                                        className="text-voxa-muted hover:text-rose-500 transition-colors"
                                    >
                                        <Icon name="delete" size="sm" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Transactions
