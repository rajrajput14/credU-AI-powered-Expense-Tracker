import { supabase } from './supabase';

const POLAR_PRICE_ID = import.meta.env.VITE_POLAR_PRICE_ID;

export const createCheckout = async (userId, email) => {
    try {
        const { data, error } = await supabase.functions.invoke('polar-checkout', {
            body: { userId, email, priceId: POLAR_PRICE_ID }
        });

        if (error) {
            console.error('Edge function error:', error);
            throw new Error(error.message || 'Failed to create checkout');
        }
        
        if (!data?.url) {
            throw new Error('No checkout URL returned from server');
        }

        return data.url;
    } catch (err) {
        console.error('Subscription Service Error:', err);
        throw err;
    }
};

export const fetchSubscription = async (userId) => {
    if (!userId) return null;
    
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return null;
    }
    
    return data;
};
