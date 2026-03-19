import { supabase } from '../lib/supabaseClient';

export const transactionService = {
  fetchTransactions: async (userId) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  addTransaction: async (transaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  updateTransaction: async (id, updates) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  deleteTransaction: async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};
