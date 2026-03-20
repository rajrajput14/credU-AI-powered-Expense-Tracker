import React, { useState } from 'react';
import Modal from './Modal';
import { supabase } from '../services/supabase';
import { useAppStore } from '../store/useAppStore';

const ProfileEditModal = ({ isOpen, onClose }) => {
    const { user, setUser } = useAppStore();
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [avatarSeed, setAvatarSeed] = useState(user?.user_metadata?.avatar_seed || user?.email || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.updateUser({
                data: { 
                    full_name: fullName,
                    avatar_seed: avatarSeed
                }
            });
            if (error) throw error;
            setUser(data.user);
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
            <form onSubmit={handleSubmit} className="space-y-4 font-body">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">Your name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-headline text-sm"
                        placeholder="Enter your name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">Profile Avatar Seed</label>
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant/10 shrink-0 shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}&backgroundColor=e2e8f0`} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <input
                            type="text"
                            className="flex-1 px-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-headline text-sm"
                            placeholder="Type anything to change your avatar"
                            value={avatarSeed}
                            onChange={(e) => setAvatarSeed(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">Email</label>
                    <input
                        type="email"
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-outline-variant/5 bg-surface-container/30 text-on-surface-variant/30 cursor-not-allowed outline-none font-black uppercase tracking-widest text-[10px]"
                        value={user?.email || ''}
                    />
                    <p className="text-[10px] text-on-surface-variant/20 mt-1 uppercase font-black tracking-widest italic">You can't change your email here.</p>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-surface font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProfileEditModal;
