import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAppStore } from '../store/useAppStore';

const TransactionFormModal = ({ isOpen, onClose, transaction = null }) => {
    const { addTransaction, updateTransaction, deleteTransaction, user } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
    });

    const categories = [
        'Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 
        'Bills', 'Education', 'Investment', 'Salary', 'Other'
    ];

    useEffect(() => {
        if (transaction) {
            setFormData({
                name: transaction.name || '',
                amount: transaction.amount || '',
                type: transaction.type || 'expense',
                category: transaction.category || 'Food',
                date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                status: transaction.status || 'completed'
            });
        } else {
            setFormData({
                name: '',
                amount: '',
                type: 'expense',
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                status: 'completed'
            });
        }
    }, [transaction, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
            alert('Please enter a valid amount greater than 0');
            return;
        }
        if (!formData.name) {
            alert('Please enter a name for the transaction');
            return;
        }

        setIsLoading(true);
        try {
            const data = {
                ...formData,
                amount: parseFloat(formData.amount),
                user_id: user?.id
            };

            if (transaction?.id) {
                await updateTransaction(transaction.id, data);
            } else {
                await addTransaction(user?.id, data);
            }
            onClose();
        } catch (err) {
            console.error(err);
            alert('Something went wrong while saving. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            await deleteTransaction(transaction.id);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={transaction ? 'Update transaction' : 'Add transaction'}>
            <form onSubmit={handleSubmit} className="space-y-4 font-body">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">What was this for?</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-headline text-sm"
                        placeholder="e.g. Groceries, Rent, Coffee"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 font-bold">$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-headline text-sm"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">Type</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-black uppercase tracking-widest text-[10px] appearance-none cursor-pointer"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="expense">Money out (Transaction)</option>
                            <option value="income">Money in (Income)</option>
                        </select>
                    </div>
                </div>

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
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">Date</label>
                    <input
                        type="date"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-black uppercase tracking-widest text-[10px]"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>

                <div className="pt-6 flex flex-col gap-3">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-surface font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processing...' : (transaction ? 'Save Changes' : 'Save Transaction')}
                    </button>
                    {transaction && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-full py-4 bg-surface-container-lowest border border-error/10 text-error hover:bg-error/5 font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-[0.98]"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default TransactionFormModal;
