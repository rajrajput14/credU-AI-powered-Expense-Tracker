import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { transactionService } from '../services/transactionService';
import { goalService } from '../services/goalService';

export const useAppStore = create((set, get) => ({
    user: null,
    transactions: [],
    goals: [],
    currency: 'USD ($)',
    loading: false,
    error: null,
    voiceEntry: null,
    
    // UI State for Modals
    isTransactionModalOpen: false,
    isGoalModalOpen: false,
    isFundGoalModalOpen: false,
    activeTransaction: null,
    activeGoal: null,
    darkMode: localStorage.getItem('darkMode') === 'true',
    budget: Number(localStorage.getItem('budget')) || 4000,
    voiceTrigger: 0,

    triggerVoice: () => set(state => ({ voiceTrigger: state.voiceTrigger + 1 })),

    setBudget: (amount) => {
        set({ budget: amount });
        localStorage.setItem('budget', amount);
    },

    setDarkMode: (isDark) => {
        set({ darkMode: isDark });
        localStorage.setItem('darkMode', isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },

    setTransactionModal: (isOpen, transaction = null) => set({ 
        isTransactionModalOpen: isOpen, 
        activeTransaction: transaction 
    }),
    setGoalModal: (isOpen, goal = null) => set({ 
        isGoalModalOpen: isOpen, 
        activeGoal: goal 
    }),
    setFundGoalModal: (isOpen, goal = null) => set({ 
        isFundGoalModalOpen: isOpen, 
        activeGoal: goal 
    }),

    setVoiceEntry: (entry) => set({ voiceEntry: entry }),
    clearVoiceEntry: () => set({ voiceEntry: null }),
    setCurrency: (currency) => set({ currency }),
    setUser: (user) => set({ user }),

    fetchInitialData: async (userId) => {
        set({ loading: true, error: null });
        try {
            const [transactions, goals] = await Promise.all([
                transactionService.fetchTransactions(userId),
                goalService.fetchGoals(userId)
            ]);
            set({ transactions, goals, loading: false });
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
            set({ error: error.message, loading: false });
        }
    },

    // Transaction Actions
    addTransaction: async (userId, data) => {
        try {
            await transactionService.addTransaction({ ...data, user_id: userId });
            // Relies on Real-Time to update the store, or we can optimistially update:
            // But we will just let Real-Time do it to guarantee DB consistency.
        } catch (error) {
            console.error(error);
            set({ error: error.message });
        }
    },
    updateTransaction: async (id, data) => {
        try {
            await transactionService.updateTransaction(id, data);
        } catch (error) {
            console.error(error);
            set({ error: error.message });
        }
    },
    deleteTransaction: async (id) => {
        try {
            await transactionService.deleteTransaction(id);
        } catch (error) {
            console.error(error);
            set({ error: error.message });
        }
    },

    // Goal Actions
    addGoal: async (userId, data) => {
        try {
            await goalService.addGoal({ ...data, user_id: userId });
        } catch (error) {
            console.error(error);
            set({ error: error.message });
        }
    },
    updateGoal: async (id, data) => {
        try {
            await goalService.updateGoal(id, data);
        } catch (error) {
            console.error(error);
            set({ error: error.message });
        }
    },
    deleteGoal: async (id) => {
        try {
            await goalService.deleteGoal(id);
        } catch (error) {
            console.error(error);
            set({ error: error.message });
        }
    },

    // Subscriptions
    subscribeToDatabase: (userId) => {
        const subscription = supabase
            .channel('public-db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` }, (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;
                console.log('Realtime Transaction Event:', eventType, newRecord || oldRecord);
                if (eventType === 'INSERT') {
                    set((state) => {
                        if (state.transactions.some(t => t.id === newRecord.id)) return state;
                        return { transactions: [newRecord, ...state.transactions].sort((a,b) => new Date(b.date) - new Date(a.date)) };
                    });
                } else if (eventType === 'DELETE') {
                    set((state) => ({ transactions: state.transactions.filter(t => t.id !== oldRecord.id) }));
                } else if (eventType === 'UPDATE') {
                    set((state) => ({
                        transactions: state.transactions.map(t => t.id === newRecord.id ? newRecord : t)
                                        .sort((a,b) => new Date(b.date) - new Date(a.date))
                    }));
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'goals', filter: `user_id=eq.${userId}` }, (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;
                console.log('Realtime Goal Event:', eventType, newRecord || oldRecord);
                if (eventType === 'INSERT') {
                    set((state) => {
                        if (state.goals.some(g => g.id === newRecord.id)) return state;
                        return { goals: [...state.goals, newRecord] };
                    });
                } else if (eventType === 'DELETE') {
                    set((state) => ({ goals: state.goals.filter(g => g.id !== oldRecord.id) }));
                } else if (eventType === 'UPDATE') {
                    set((state) => ({
                        goals: state.goals.map(g => g.id === newRecord.id ? newRecord : g)
                    }));
                }
            })
            .subscribe((status) => {
                console.log('Realtime Subscription Status:', status);
            });

        return () => supabase.removeChannel(subscription);
    }
}));
