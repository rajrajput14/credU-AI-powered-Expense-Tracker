import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { transactionService } from '../services/transactionService';
import { goalService } from '../services/goalService';
import { billingService } from '../services/billingService';

export const useAppStore = create((set, get) => ({
    user: null,
    transactions: [],
    goals: [],
    currency: localStorage.getItem('currency') || 'USD',
    loading: false,
    error: null,
    voiceEntry: null,
    subscription: null,
    
    // UI State for Modals
    isTransactionModalOpen: false,
    isGoalModalOpen: false,
    isFundGoalModalOpen: false,
    activeTransaction: null,
    activeGoal: null,
    darkMode: localStorage.getItem('darkMode') === 'true',
    budget: Number(localStorage.getItem('budget')) || 4000,
    voiceTrigger: 0,
    voiceUsage: 0,
    isPaywallOpen: false,

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

    availableCurrencies: [
        { code: 'USD', symbol: '$', label: 'US Dollar' },
        { code: 'EUR', symbol: '€', label: 'Euro' },
        { code: 'GBP', symbol: '£', label: 'British Pound' },
        { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
        { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
        { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
        { code: 'AUD', symbol: 'AU$', label: 'Australian Dollar' },
        { code: 'SGD', symbol: 'SG$', label: 'Singapore Dollar' },
        { code: 'AED', symbol: 'AED', label: 'UAE Dirham' },
    ],
    setVoiceEntry: (entry) => set({ voiceEntry: entry }),
    clearVoiceEntry: () => set({ voiceEntry: null }),
    setCurrency: (currency) => {
        set({ currency });
        localStorage.setItem('currency', currency);
    },
    
    formatCurrency: (amount) => {
        const currency = get().currency;
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: currency 
        }).format(amount || 0);
    },

    getCurrencySymbol: () => {
        const currencyCode = get().currency;
        const currencies = get().availableCurrencies;
        const found = currencies.find(c => c.code === currencyCode);
        return found ? found.symbol : '$';
    },
    setUser: (user) => set({ user }),

    isPro: () => {
        const sub = get().subscription;
        if (!sub) return false;
        
        // Active or Trialing always have access
        if (['active', 'trialing'].includes(sub.status)) return true;
        
        // Past Due: Allow 3-day grace period
        if (sub.status === 'past_due' && sub.updated_at) {
            const lastUpdated = new Date(sub.updated_at);
            const now = new Date();
            const diffDays = (now - lastUpdated) / (1000 * 60 * 60 * 24);
            return diffDays <= 3;
        }
        
        return false;
    },

    setPaywallOpen: (isOpen) => set({ isPaywallOpen: isOpen }),

    getMonthlyTransactionCount: () => {
        const transactions = get().transactions;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return transactions.filter(t => new Date(t.date) >= startOfMonth && t.type === 'expense').length;
    },

    isLimitReached: () => {
        if (get().isPro()) return false;
        return get().getMonthlyTransactionCount() >= 20;
    },

    isVoiceLimitReached: () => {
        if (get().isPro()) return false;
        return get().voiceUsage >= 5;
    },

    incrementVoiceUsage: () => set(state => ({ voiceUsage: state.voiceUsage + 1 })),

    fetchInitialData: async (userId) => {
        set({ loading: true, error: null });
        try {
            console.log("Fetching data for user:", userId);
            const [transactions, goals, subscription] = await Promise.all([
                transactionService.fetchTransactions(userId),
                goalService.fetchGoals(userId),
                billingService.fetchSubscription(userId)
            ]);
            console.log("Fetched Subscription:", subscription);
            set({ transactions, goals, subscription, loading: false });
        } catch (error) {
            console.error('CRITICAL: Failed to fetch initial data:', error);
            set({ error: error.message, loading: false });
        }
    },

    // Transaction Actions
    addTransaction: async (userId, data) => {
        const tempId = crypto.randomUUID();
        const optimisticTx = { ...data, id: tempId, user_id: userId, created_at: new Date().toISOString() };
        
        // Optimistic update
        set(state => ({ 
            transactions: [optimisticTx, ...state.transactions].sort((a,b) => new Date(b.date) - new Date(a.date)) 
        }));

        try {
            await transactionService.addTransaction({ ...data, user_id: userId });
            // Real-time listener will eventually replace/confirm this, 
            // but the tempId check in subscribeToDatabase prevents duplicates.
        } catch (error) {
            console.error(error);
            // Rollback on error
            set(state => ({ transactions: state.transactions.filter(t => t.id !== tempId), error: error.message }));
        }
    },
    updateTransaction: async (id, data) => {
        const previousTx = get().transactions.find(t => t.id === id);
        
        // Optimistic update
        set(state => ({
            transactions: state.transactions.map(t => t.id === id ? { ...t, ...data } : t)
                .sort((a,b) => new Date(b.date) - new Date(a.date))
        }));

        try {
            await transactionService.updateTransaction(id, data);
        } catch (error) {
            console.error(error);
            // Rollback
            set(state => ({ 
                transactions: state.transactions.map(t => t.id === id ? previousTx : t)
                    .sort((a,b) => new Date(b.date) - new Date(a.date)),
                error: error.message 
            }));
        }
    },
    deleteTransaction: async (id) => {
        const previousTx = get().transactions.find(t => t.id === id);

        // Optimistic update
        set(state => ({ transactions: state.transactions.filter(t => t.id !== id) }));

        try {
            await transactionService.deleteTransaction(id);
        } catch (error) {
            console.error(error);
            // Rollback
            set(state => ({ transactions: [previousTx, ...state.transactions].sort((a,b) => new Date(b.date) - new Date(a.date)), error: error.message }));
        }
    },

    // Goal Actions
    addGoal: async (userId, data) => {
        const tempId = crypto.randomUUID();
        const optimisticGoal = { ...data, id: tempId, user_id: userId, created_at: new Date().toISOString() };
        
        set(state => ({ goals: [...state.goals, optimisticGoal] }));

        try {
            await goalService.addGoal({ ...data, user_id: userId });
        } catch (error) {
            console.error(error);
            set(state => ({ goals: state.goals.filter(g => g.id !== tempId), error: error.message }));
        }
    },
    updateGoal: async (id, data) => {
        const previousGoal = get().goals.find(g => g.id === id);
        
        set(state => ({
            goals: state.goals.map(g => g.id === id ? { ...g, ...data } : g)
        }));

        try {
            await goalService.updateGoal(id, data);
        } catch (error) {
            console.error(error);
            set(state => ({ 
                goals: state.goals.map(g => g.id === id ? previousGoal : g),
                error: error.message 
            }));
        }
    },
    deleteGoal: async (id) => {
        const previousGoal = get().goals.find(g => g.id === id);
        
        set(state => ({ goals: state.goals.filter(g => g.id !== id) }));

        try {
            await goalService.deleteGoal(id);
        } catch (error) {
            console.error(error);
            set(state => ({ goals: [...state.goals, previousGoal], error: error.message }));
        }
    },

    // Subscription Actions
    createCheckout: async (userId, email, priceId, productId) => {
        try {
            const { data, error } = await supabase.functions.invoke('polar-checkout', {
                body: { userId, email, priceId, productId }
            });
            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            set({ error: error.message });
        }
    },

    cancelSubscription: async (subscriptionId) => {
        set({ loading: true });
        try {
            const result = await billingService.cancelSubscription(subscriptionId);
            if (result.error) throw new Error(result.error);
            set({ loading: false });
            return true;
        } catch (error) {
            console.error('Cancellation error:', error);
            set({ error: error.message, loading: false });
            return false;
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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions', filter: `user_id=eq.${userId}` }, (payload) => {
                const { eventType, new: newRecord } = payload;
                console.log('Realtime Subscription Event:', eventType, newRecord);
                if (eventType === 'INSERT' || eventType === 'UPDATE') {
                    set({ subscription: newRecord });
                } else if (eventType === 'DELETE') {
                    set({ subscription: null });
                }
            })
            .subscribe((status) => {
                console.log('Realtime Subscription Status:', status);
            });

        return () => supabase.removeChannel(subscription);
    }
}));
