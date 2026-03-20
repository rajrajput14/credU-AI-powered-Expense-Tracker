import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAppStore } from '../store/useAppStore';

const GoalFormModal = ({ isOpen, onClose, goal = null }) => {
    const { addGoal, updateGoal, deleteGoal, user, getCurrencySymbol } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        target_amount: '',
        current_amount: '0',
        deadline: '',
        category: 'Travel'
    });

    const categories = ['Travel', 'Emergency', 'Vehicle', 'Tech', 'Home', 'Investment', 'Other'];

    useEffect(() => {
        if (goal) {
            setFormData({
                title: goal.title || '',
                target_amount: goal.target_amount || '',
                current_amount: goal.current_amount || '0',
                deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
                category: goal.category || 'Travel'
            });
        } else {
            setFormData({
                title: '',
                target_amount: '',
                current_amount: '0',
                deadline: '',
                category: 'Travel'
            });
        }
    }, [goal, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) {
            alert('Please enter a title for your goal');
            return;
        }
        if (!formData.target_amount || isNaN(parseFloat(formData.target_amount)) || parseFloat(formData.target_amount) <= 0) {
            alert('Please enter a valid target amount greater than 0');
            return;
        }

        setIsLoading(true);
        try {
            const data = {
                ...formData,
                target_amount: parseFloat(formData.target_amount),
                current_amount: parseFloat(formData.current_amount || 0),
                user_id: user?.id
            };

            if (goal?.id) {
                await updateGoal(goal.id, data);
            } else {
                await addGoal(user?.id, data);
            }
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to save goal. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            await deleteGoal(goal.id);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={goal ? 'Update goal' : 'New goal'}>
            <form onSubmit={handleSubmit} className="space-y-4 font-body">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">What are you saving for?</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-headline text-sm"
                        placeholder="e.g. New laptop, Dream vacation"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">How much do you need?</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 font-bold">$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-headline text-sm"
                                placeholder="0.00"
                                value={formData.target_amount}
                                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">Already saved</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 font-bold">$</span>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-headline text-sm"
                                placeholder="0.00"
                                value={formData.current_amount}
                                onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">Category</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-black uppercase tracking-widest text-[10px] appearance-none cursor-pointer"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">Target date (optional)</label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-black uppercase tracking-widest text-[10px]"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-6 flex flex-col gap-3">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-secondary hover:bg-secondary/90 text-surface font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg shadow-secondary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : (goal ? 'Save goal' : 'Add goal')}
                    </button>
                    {goal && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-full py-4 bg-surface-container-lowest border border-error/10 text-error hover:bg-error/5 font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-[0.98]"
                        >
                            Delete goal
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default GoalFormModal;
