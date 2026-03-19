import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Bell, Mic, Volume2, Info, ChevronRight } from 'lucide-react'
import { getSoundSettings, toggleSoundSettings } from '../services/audioService'

const Settings = () => {
    const [soundEnabled, setSoundEnabled] = useState(getSoundSettings())

    const handleToggleSound = () => {
        const newVal = !soundEnabled
        setSoundEnabled(newVal)
        toggleSoundSettings(newVal)
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 pb-20 lg:pb-0">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-voxa-text">App Settings</h2>
                <p className="text-voxa-muted font-medium">Customize your Voxa experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Voice & Sound Panel */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-voxa-border bg-voxa-card p-8 shadow-sm flex flex-col"
                >
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-voxa-primary">
                            <Volume2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-voxa-text">Audio Feedback</h3>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-voxa-bg border border-voxa-border mb-6">
                        <div>
                            <p className="font-bold text-voxa-text">Enable Sound Effects</p>
                            <p className="text-xs text-voxa-muted">Status: {soundEnabled ? 'Active' : 'Muted'}</p>
                        </div>
                        <button 
                            onClick={handleToggleSound}
                            className={clsx(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 outline-none",
                                soundEnabled ? "bg-voxa-primary" : "bg-voxa-muted"
                            )}
                        >
                            <div className={clsx(
                                "h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm",
                                soundEnabled ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                    </div>

                    <div className="mt-auto flex items-start gap-4 rounded-2xl bg-indigo-500/5 p-5 border border-indigo-500/10">
                        <div className="p-2 rounded-lg bg-indigo-500/10">
                            <Bell className="text-voxa-primary" size={18} />
                        </div>
                        <p className="text-xs text-voxa-muted leading-relaxed">
                            Immediate auditory confirmation for voice entries helps you stay focused without needing to check the screen constantly.
                        </p>
                    </div>
                </motion.div>

                {/* Voice Guide Panel */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-3xl border border-voxa-border bg-voxa-card p-8 shadow-sm"
                >
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-voxa-secondary">
                            <Mic size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-voxa-text">Voice Guide</h3>
                    </div>

                    <div className="space-y-3">
                        {[
                            { text: "spent 500 on dinner yesterday", label: "Expense" },
                            { text: "got 5000 from freelancing today", label: "Income" },
                            { text: "added 200 for transport", label: "Quick Entry" }
                        ].map((item, idx) => (
                            <div key={idx} className="group flex items-center justify-between rounded-2xl bg-voxa-bg border border-voxa-border p-4 hover:border-voxa-primary transition-all cursor-default">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-voxa-primary/60">{item.label}</p>
                                    <p className="text-sm italic text-voxa-muted font-medium group-hover:text-voxa-text transition-colors">"{item.text}"</p>
                                </div>
                                <ChevronRight size={16} className="text-voxa-muted opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                        ))}
                    </div>
                </motion.div>
                
                {/* System Information Panel */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-voxa-border bg-voxa-card p-8 shadow-sm md:col-span-2"
                >
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                            <Info size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-voxa-text">Internal Specification</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-voxa-muted">Core Engine</p>
                            <p className="font-bold text-voxa-text text-lg">Gemini 2.5</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-voxa-muted">Status</p>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                <p className="font-bold text-voxa-text text-lg">Synced</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-voxa-muted">Storage</p>
                            <p className="font-bold text-voxa-text text-lg">DB-Primary</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-voxa-muted">Interface</p>
                            <p className="font-bold text-voxa-text text-lg">Voxa V2</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Settings
