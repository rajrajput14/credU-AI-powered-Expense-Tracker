import { create } from 'zustand'
import { supabase, fetchTransactions, addTransaction, deleteTransactionById, updateTransactionById } from '../services/supabase'

export const useTransactionStore = create((set, get) => ({
    transactions: [],
    loading: false,
    error: null,
    voiceEntry: null, // { amount, type, category, note }

    setVoiceEntry: (entry) => set({ voiceEntry: entry }),
    clearVoiceEntry: () => set({ voiceEntry: null }),

    fetchTransactions: async (userId) => {
        set({ loading: true, error: null })
        try {
            const data = await fetchTransactions(userId)
            set({ transactions: data, loading: false })
        } catch (error) {
            set({ error: error.message, loading: false })
        }
    },

    addTransaction: async (userId, transactionData) => {
        try {
            const newTransaction = await addTransaction({ ...transactionData, user_id: userId })
            // Optimistic update (optional, but real-time will handle it too)
            set((state) => ({ transactions: [newTransaction, ...state.transactions] }))
        } catch (error) {
            set({ error: error.message })
        }
    },

    deleteTransaction: async (id) => {
        try {
            await deleteTransactionById(id)
            set((state) => ({ transactions: state.transactions.filter(t => t.id !== id) }))
        } catch (error) {
            set({ error: error.message })
        }
    },

    updateTransaction: async (id, updates) => {
        try {
            const updated = await updateTransactionById(id, updates)
            set((state) => ({
                transactions: state.transactions.map(t => t.id === id ? updated : t)
            }))
        } catch (error) {
            set({ error: error.message })
        }
    },

    subscribeToTransactions: (userId) => {
        const subscription = supabase
            .channel('public:transactions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` }, (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload
                
                if (eventType === 'INSERT') {
                    set((state) => {
                        if (state.transactions.some(t => t.id === newRecord.id)) return state
                        return { transactions: [newRecord, ...state.transactions] }
                    })
                } else if (eventType === 'DELETE') {
                    set((state) => ({ transactions: state.transactions.filter(t => t.id !== oldRecord.id) }))
                } else if (eventType === 'UPDATE') {
                    set((state) => ({
                        transactions: state.transactions.map(t => t.id === newRecord.id ? newRecord : t)
                    }))
                }
            })
            .subscribe()

        return () => supabase.removeChannel(subscription)
    }
}))
