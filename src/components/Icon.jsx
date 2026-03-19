import { motion } from 'framer-motion'
import { 
    Utensils, Car, ShoppingBag, Receipt, Repeat, TrendingUp, PiggyBank, AlertTriangle, Sparkles, Brain,
    Gauge, Activity, LineChart, PieChart, Flame, Target,
    LayoutDashboard, BarChart3, Settings, LogOut, Sun, Moon,
    Search, Filter, Trash2, Plus, X, Loader2, Check, ArrowUpRight, ArrowDownLeft, TrendingDown,
    DollarSign, Wallet, Store, Clock, Mic, LogIn, UserPlus
} from 'lucide-react'
import clsx from 'clsx'

const iconMap = {
    // Categories
    food: Utensils,
    transport: Car,
    shopping: ShoppingBag,
    bills: Receipt,
    subscriptions: Repeat,
    income: TrendingUp,
    other: ShoppingBag,
    
    // Insights & Analytics
    savings: PiggyBank,
    alerts: AlertTriangle,
    insights: Sparkles,
    brain: Brain,
    score: Activity,
    activity: Activity,
    trend: LineChart,
    pie: PieChart,
    forecast: TrendingUp,
    burn: Flame,
    goal: Target,
    
    // Navigation
    dashboard: LayoutDashboard,
    transactions: Receipt,
    analytics: BarChart3,
    settings: Settings,
    logout: LogOut,
    sun: Sun,
    moon: Moon,

    // UI Actions
    search: Search,
    filter: Filter,
    delete: Trash2,
    add: Plus,
    close: X,
    loading: Loader2,
    success: Check,
    arrowUpRight: ArrowUpRight,
    arrowDownLeft: ArrowDownLeft,
    trendingDown: TrendingDown,
    
    // Misc
    dollar: DollarSign,
    wallet: Wallet,
    store: Store,
    clock: Clock,
    mic: Mic,
    login: LogIn,
    userAdd: UserPlus
}

const sizeMap = {
    sm: 16,
    md: 20,
    lg: 28,
    xl: 32
}

const Icon = ({ name, size = 'md', className, animate = false, active = false }) => {
    // Fallback to Sparkles if name is unmapped
    const LucideIcon = iconMap[name] || Sparkles
    const pxSize = sizeMap[size] || sizeMap.md

    const Inner = (
        <LucideIcon 
            size={pxSize} 
            strokeWidth={1.5} 
            className={clsx(
                "transition-all duration-200", 
                active ? "opacity-100" : "opacity-70 group-hover:opacity-100",
                className
            )} 
        />
    )

    if (animate) {
        return (
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx("inline-flex items-center justify-center cursor-pointer", className)}
            >
                {Inner}
            </motion.div>
        )
    }

    return (
        <div className="inline-flex items-center justify-center">
            {Inner}
        </div>
    )
}

export default Icon
