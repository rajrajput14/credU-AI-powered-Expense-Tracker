import { supabase } from '../lib/supabaseClient';

// Removed hardcoded URL to use supabase.functions.invoke

export const billingService = {
  /**
   * Status mapping to determine if a user should have Pro access.
   * Access is only granted for 'active' or 'trialing' states.
   */
  hasAccess: (status) => {
    return ['active', 'trialing'].includes(status);
  },

  /**
   * Initiates a Polar checkout session.
   */
  createCheckout: async (userId, email, priceId) => {
    try {
      const { data, error } = await supabase.functions.invoke('polar-checkout', {
        body: { userId, email, priceId }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      throw error;
    }
  },

  /**
   * Fetches the current subscription details for a user.
   * Forces a fresh check from the database.
   */
  fetchSubscription: async (userId) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows found'
      console.error('Error fetching subscription:', error);
      return null;
    }

    return (data && data.length > 0) ? data[0] : null;
  },

  /**
   * Manages subscription cancellation (to be implemented via edge function)
   */
  cancelSubscription: async (subscriptionId) => {
    try {
      const { data, error } = await supabase.functions.invoke('subscription-api/cancel', {
        body: { subscriptionId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Cancellation Error:', error);
      return { error: error.message };
    }
  }
};
