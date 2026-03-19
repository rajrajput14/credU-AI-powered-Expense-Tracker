import Icon from './Icon'
import { motion } from 'framer-motion'
import { useLocation, useNavigate, Link, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import VoiceButton from './VoiceButton'
import { supabase } from '../services/supabase'
import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import CurrencySelector from './CurrencySelector'

const Layout = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const { theme, toggleTheme } = useTheme()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate('/auth')
    }

    const navItems = [
        { path: '/', icon: 'dashboard', label: 'Dashboard' },
        { path: '/transactions', icon: 'transactions', label: 'Transactions' },
        { path: '/analytics', icon: 'analytics', label: 'Analytics' },
        { path: '/settings', icon: 'settings', label: 'Settings' }
    ]

    return (
        <div className="flex min-h-screen bg-voxa-bg text-voxa-text transition-colors duration-200">
            {/* Desktop Sidebar */}
            <aside className="fixed hidden h-screen w-64 flex-col border-r border-voxa-border bg-voxa-bg p-6 lg:flex">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]" />
                        <span className="text-xl font-bold tracking-tight">Voxa</span>
                    </div>
                    {/* Theme Toggle Desktop */}
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-xl hover:bg-white/5 text-voxa-muted hover:text-voxa-text transition-all"
                    >
                        {theme === 'dark' ? <Icon name="sun" size="md" /> : <Icon name="moon" size="md" />}
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all group",
                                    isActive ? "bg-indigo-500/10 text-voxa-primary" : "text-voxa-muted hover:bg-white/5 hover:text-voxa-text"
                                )}
                            >
                                <Icon name={item.icon} size="md" active={isActive} className={isActive ? "text-voxa-primary" : ""} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="border-t border-voxa-border pt-4 space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">{user?.email?.split('@')[0] || 'User'}</p>
                            <p className="text-xs text-voxa-muted truncate">{user?.email || 'Premium Plan'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                        <Icon name="logout" size="md" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 bg-voxa-bg">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mx-auto max-w-7xl p-6 lg:p-10"
                >
                    <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h1>
                        <CurrencySelector />
                    </header>
                    <Outlet />
                </motion.div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 flex h-20 w-full items-center justify-around border-t border-voxa-border bg-voxa-card/80 px-4 backdrop-blur-xl lg:hidden z-50">
                    {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex flex-col items-center gap-1 group",
                                isActive ? "text-voxa-primary" : "text-voxa-muted"
                            )}
                        >
                            <Icon name={item.icon} size="lg" active={isActive} />
                        </Link>
                    )
                })}
            </nav>

            {/* Voice Mic Component */}
            <VoiceButton />
        </div>
    )
}

export default Layout
