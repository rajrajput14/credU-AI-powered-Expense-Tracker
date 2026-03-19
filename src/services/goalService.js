import { supabase } from '../lib/supabaseClient';

export const goalService = {
  fetchGoals: async (userId) => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('deadline', { ascending: true });
      
    if (error) throw error;
    return data;
  },

  addGoal: async (goal) => {
    const { data, error } = await supabase
      .from('goals')
      .insert([goal])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  updateGoal: async (id, updates) => {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  deleteGoal: async (id) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};
