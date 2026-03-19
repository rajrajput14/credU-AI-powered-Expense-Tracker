import { useState } from 'react'
import { supabase } from '../services/supabase'
import { motion } from 'framer-motion'
import { Wallet, LogIn, UserPlus, Loader2 } from 'lucide-react'

const Auth = () => {
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                alert("Signup successful! You can now log in.")
                setIsSignUp(false)
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-voxa-bg px-4 font-inter text-voxa-text transition-colors duration-200">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md space-y-8 rounded-3xl border border-voxa-border bg-voxa-card p-10 shadow-2xl"
            >
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-voxa-primary to-voxa-secondary shadow-lg shadow-indigo-500/20">
                        <Wallet className="text-white" size={32} />
                    </div>
                    <h2 className="mt-6 text-3xl font-black tracking-tight text-voxa-text italic">VOXA</h2>
                    <p className="mt-2 text-sm text-voxa-muted font-medium">
                        {isSignUp ? "Create your premium account" : "Welcome back to your dashboard"}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-voxa-muted ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border border-voxa-border bg-voxa-bg p-4 text-voxa-text outline-none focus:border-voxa-primary transition-all placeholder:text-voxa-muted/30"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-voxa-muted ml-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border border-voxa-border bg-voxa-bg p-4 text-voxa-text outline-none focus:border-voxa-primary transition-all placeholder:text-voxa-muted/30"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-rose-500 font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-voxa-primary to-voxa-secondary py-4 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                        {isSignUp ? "Create Account" : "Access Dashboard"}
                    </button>
                </form>

                <div className="text-center">
                    <button 
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm font-bold text-voxa-primary hover:text-voxa-secondary transition-colors"
                    >
                        {isSignUp ? "Already a member? Sign In" : "New to Voxa? Join now"}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default Auth
