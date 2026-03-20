import { supabase } from './supabase';

export const supportService = {
  fetchFAQs: async () => {
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  createTicket: async (userId, message, type = 'chat') => {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([{ 
        user_id: userId, 
        message, 
        type, 
        status: 'open' 
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  subscribeToTickets: (userId, onUpdate) => {
    return supabase
      .channel('support_tickets_changes')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'support_tickets',
          filter: `user_id=eq.${userId}`
        },
        (payload) => onUpdate(payload.new)
      )
      .subscribe();
  }
};
