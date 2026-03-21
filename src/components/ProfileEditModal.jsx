import React, { useState, useRef } from 'react';
import Modal from './Modal';
import { useAppStore } from '../store/useAppStore';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';

const ProfileEditModal = ({ isOpen, onClose }) => {
    const { user, updateAvatar, updateProfile } = useAppStore();
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [avatarSeed, setAvatarSeed] = useState(user?.user_metadata?.avatar_seed || user?.email || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 2 * 1024 * 1024) {
            alert("File is too large. Max size is 2MB.");
            return;
        }

        setIsUploading(true);
        try {
            await updateAvatar(user.id, file);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Update profile table and auth metadata
            await updateProfile(user.id, { 
                name: fullName,
                avatar_seed: avatarSeed 
            });
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
            <form onSubmit={handleSubmit} className="space-y-6 font-body">
                {/* Photo Upload Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-[3px] shadow-xl">
                            <div className="w-full h-full bg-surface-container-lowest rounded-full border-4 border-surface-container-lowest overflow-hidden flex items-center justify-center relative">
                                {isUploading ? (
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                ) : (
                                    <img 
                                        src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}&backgroundColor=e2e8f0`} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover" 
                                    />
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-surface rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 border-2 border-surface-container-lowest"
                        >
                            <Camera size={16} />
                        </button>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    <p className="text-[10px] text-on-surface-variant/40 font-black uppercase tracking-[0.2em]">Tap camera to upload photo</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic px-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-5 py-4 rounded-2xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-headline text-sm shadow-sm"
                            placeholder="Enter your name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    
                    {!user?.user_metadata?.avatar_url && (
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic px-1">Avatar Style (Seed)</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="text"
                                    className="flex-1 px-5 py-4 rounded-2xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-headline text-sm shadow-sm"
                                    placeholder="Type to change generated avatar"
                                    value={avatarSeed}
                                    onChange={(e) => setAvatarSeed(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic px-1">Linked Email</label>
                        <input
                            type="email"
                            disabled
                            className="w-full px-5 py-4 rounded-2xl border border-outline-variant/5 bg-surface-container/30 text-on-surface-variant/30 cursor-not-allowed outline-none font-bold text-sm"
                            value={user?.email || ''}
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 bg-surface-container/20 text-on-surface font-black uppercase tracking-widest text-[10px] rounded-2xl border border-outline-variant/10 hover:bg-surface-container/30 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving || isUploading}
                        className="flex-[2] py-4 bg-primary hover:bg-primary/90 text-surface font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : 'Save profile'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProfileEditModal;
