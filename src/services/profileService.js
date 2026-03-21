import { supabase } from './supabase';

export const profileService = {
    async fetchProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({ 
                id: userId, 
                ...updates,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async uploadAvatar(userId, file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        // Update profile table
        await this.updateProfile(userId, { avatar_url: publicUrl });

        // Update auth metadata
        const { data: { user }, error: authError } = await supabase.auth.updateUser({
            data: { avatar_url: publicUrl }
        });

        if (authError) throw authError;

        return { publicUrl, user };
    }
};
