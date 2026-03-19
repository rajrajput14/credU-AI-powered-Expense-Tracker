import { useState } from 'react';
import Modal from './Modal';
import { useAppStore } from '../store/useAppStore';

const FundGoalModal = ({ isOpen, onClose, goal }) => {
    const { updateGoal } = useAppStore();
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount)) return;

        const newAmount = (goal.current_amount || 0) + parseFloat(amount);
        await updateGoal(goal.id, { current_amount: newAmount });
        setAmount('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Capital Injection: ${goal?.title}`}>
            <form onSubmit={handleSubmit} className="space-y-4 font-body">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 mb-4 italic">
                        Current Sphere Saturation: <span className="text-on-surface font-bold text-xs">${goal?.current_amount || 0}</span> / ${goal?.target_amount}
                    </p>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2 italic">Amount to Inject</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 font-bold">$</span>
                        <input
                            type="number"
                            step="0.01"
                            required
                            autoFocus
                            className="w-full pl-8 pr-4 py-4 rounded-2xl border border-outline-variant/10 bg-surface-container/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface text-3xl font-black font-headline"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-4 bg-secondary hover:bg-secondary/90 text-surface font-black uppercase tracking-widest text-sm rounded-2xl transition-all shadow-lg shadow-secondary/20 active:scale-[0.98]"
                    >
                        Confirm Injection
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default FundGoalModal;
