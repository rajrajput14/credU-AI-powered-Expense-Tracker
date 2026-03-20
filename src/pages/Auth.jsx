import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock, User, ArrowLeft, ArrowRight } from 'lucide-react';

const Auth = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot' | 'reset'
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName }
                    }
                });
                if (error) throw error;
                setSuccessMessage("All set! Check your email to verify your account.");
                setMode('login');
            } else if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate('/dashboard');
            } else if (mode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth?mode=reset`,
                });
                if (error) throw error;
                setSuccessMessage("Check your email for a link to reset your password.");
            } else if (mode === 'reset') {
                if (password !== confirmPassword) throw new Error("Passwords do not match");
                const { error } = await supabase.auth.updateUser({ password });
                if (error) throw error;
                setSuccessMessage("Your password is updated! You can sign in now.");
                setMode('login');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4 md:p-6 font-body">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-outline-variant/10 min-h-[700px]">
                
                {/* Branding / Visual Side (Left on Desktop) */}
                <div className="hidden lg:flex flex-col justify-between p-12 relative bg-on-surface text-white overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-[120px]"></div>
                        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-secondary rounded-full blur-[100px]"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="font-headline text-3xl font-bold mb-12 cursor-pointer" onClick={() => navigate('/')}>credU</div>
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={mode}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="max-w-md"
                            >
                                {mode === 'login' && (
                                    <>
                                        <h2 className="text-4xl font-bold mb-6 font-headline leading-tight">Welcome back to<br/><span className="text-primary-container">credU.</span></h2>
                                        <p className="text-white/60 text-lg leading-relaxed">See your money clearly and make better choices.</p>
                                    </>
                                )}
                                {mode === 'signup' && (
                                    <>
                                        <h2 className="text-4xl font-bold mb-6 font-headline leading-tight">Start your<br/><span className="text-primary-container">savings journey.</span></h2>
                                        <p className="text-white/60 text-lg leading-relaxed">Join others who are saving more with our AI tools.</p>
                                    </>
                                )}
                                {(mode === 'forgot' || mode === 'reset') && (
                                    <>
                                        <h2 className="text-4xl font-bold mb-6 font-headline leading-tight">Let's reset<br/><span className="text-primary-container">your password.</span></h2>
                                        <p className="text-white/60 text-lg leading-relaxed">Choose a new password to get back to your account.</p>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="relative z-10 mt-auto">
                        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5">
                            <div className="flex gap-4 items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary-container">shield</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Your data is safe</p>
                                    <p className="text-xs text-white/40">Protected and private</p>
                                </div>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed">We keep your info private. Only you can see and manage your money.</p>
                        </div>
                    </div>
                </div>

                {/* Form Side (Right on Desktop) */}
                <div className="flex flex-col justify-center p-8 md:p-16 bg-surface-bright relative">
                    <button 
                        onClick={() => navigate('/')}
                        className="absolute top-8 left-8 p-2 rounded-full hover:bg-surface-container transition-all lg:hidden"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="max-w-sm mx-auto w-full">
                        <div className="mb-10 text-center lg:text-left">
                            <h3 className="text-3xl font-bold mb-2 font-headline text-on-surface">
                                {mode === 'login' ? 'Welcome back!' : mode === 'signup' ? 'Join credU' : mode === 'forgot' ? 'Forgot password?' : 'Reset password'}
                            </h3>
                            <p className="text-on-surface-variant text-sm">
                                {mode === 'login' ? 'Sign in to see your money story' : 
                                 mode === 'signup' ? 'Create an account to get started' : 
                                 mode === 'forgot' ? "We'll email you a link to reset your password" : 'Pick a strong new password'}
                            </p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-6">
                            {(error || successMessage) && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl text-sm font-medium border ${error ? 'bg-error/5 text-error border-error/20' : 'bg-green-50 text-green-700 border-green-200'}`}
                                >
                                    {error || successMessage}
                                </motion.div>
                            )}

                            <div className="space-y-5">
                                {mode === 'signup' && (
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                                            <input 
                                                required
                                                type="text"
                                                value={fullName}
                                                onChange={e => setFullName(e.target.value)}
                                                placeholder="John Doe"
                                                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 text-on-surface outline-none focus:border-primary transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {mode !== 'reset' && (
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                                            <input 
                                                required
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="name@email.com"
                                                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 text-on-surface outline-none focus:border-primary transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {mode !== 'forgot' && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                                            {mode === 'login' && (
                                                <button 
                                                    type="button"
                                                    onClick={() => setMode('forgot')}
                                                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                                                >
                                                    Forgot?
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                                            <input 
                                                required
                                                type="password"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 text-on-surface outline-none focus:border-primary transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {mode === 'reset' && (
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                                            <input 
                                                required
                                                type="password"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 text-on-surface outline-none focus:border-primary transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full fluid-gradient text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Join Now' : 'Save'}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            {mode === 'login' ? (
                                <p className="text-sm text-on-surface-variant font-medium">
                                    New to credU? <button onClick={() => setMode('signup')} className="text-primary font-bold hover:underline">Join Now</button>
                                </p>
                            ) : (
                                <button 
                                    onClick={() => setMode('login')} 
                                    className="text-sm text-on-surface-variant font-medium hover:text-on-surface transition-colors flex items-center gap-2 mx-auto"
                                >
                                    <ArrowLeft size={14} /> Back to Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
