import { supabase } from '../lib/supabaseClient'

export { supabase }

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export const signOut = async () => {
    await supabase.auth.signOut()
}

// Transactions
export const fetchTransactions = async (userId) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
    
    if (error) throw error
    return data
}

export const addTransaction = async (transaction) => {
    const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
    
    if (error) throw error
    return data[0]
}

export const deleteTransactionById = async (id) => {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

export const updateTransactionById = async (id, updates) => {
    const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
    
    if (error) throw error
    return data[0]
}
