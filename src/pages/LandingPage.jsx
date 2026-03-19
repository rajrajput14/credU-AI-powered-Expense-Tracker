import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle')

    const handleJoinWaitlist = (e) => {
        e.preventDefault()
        if (!email) return
        setStatus('loading')
        setTimeout(() => {
            setStatus('success')
        }, 800)
    }

    const scrollToWaitlist = () => {
        document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
    }
    
    const scrollToFeatures = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="bg-[#f8f9ff]  text-[#171c23] antialiased overflow-x-hidden selection:bg-[#e9ddff] selection:text-[#5516be] min-h-screen">
            {/* Top Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl transition-all">
                <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-12">
                        <button onClick={() => window.scrollTo(0,0)} className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tighter ">credU</button>
                        <div className="hidden md:flex items-center gap-8">
                            <button onClick={scrollToFeatures} className="text-slate-900 dark:text-slate-50 font-bold border-b-2 border-slate-900 dark:border-slate-50 pb-1  tracking-tight transition-colors duration-200">Features</button>
                            <button className="text-slate-500 dark:text-slate-400 font-medium  tracking-tight hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-200">Security</button>
                            <button className="text-slate-500 dark:text-slate-400 font-medium  tracking-tight hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-200">Pricing</button>
                            <button className="text-slate-500 dark:text-slate-400 font-medium  tracking-tight hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-200">About</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/auth')} className="text-slate-500 font-medium hover:text-[#000000] transition-colors">Login</button>
                        <button onClick={scrollToWaitlist} className="bg-[#000000] text-[#ffffff] px-6 py-2.5 rounded-xl font-bold hover:scale-[1.03] transition-transform active:scale-95">Join Waitlist</button>
                    </div>
                </div>
            </nav>

            <main className="pt-32 hero-gradient min-h-screen">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-[3.5rem] md:text-[5rem] font-extrabold  leading-[1.1] tracking-tighter text-[#000000] mb-6">
                        Stop tracking. <br/>
                        <span className="text-gradient">Start understanding</span> your money.
                    </h1>
                    <p className="text-xl text-[#444748] max-w-2xl mx-auto mb-10 leading-relaxed">
                        AI-powered expense tracking that shows where your money goes—and how to fix it.
                    </p>

                    {/* Email Capture */}
                    <div id="waitlist" className="max-w-md mx-auto mb-6 scroll-mt-32">
                        {status === 'success' ? (
                            <div className="flex items-center justify-center p-1.5 h-14 bg-emerald-500/10 text-emerald-600 rounded-xl  font-bold border border-emerald-500/20 shadow-lg">
                                You're on the list! Keep an eye on your inbox.
                            </div>
                        ) : (
                            <form onSubmit={handleJoinWaitlist} className="flex p-1.5 glass-card rounded-xl border border-white/40 shadow-[0_20px_40px_rgba(23,28,35,0.06)] transition-all focus-within:ring-2 focus-within:ring-[#6b38d4]/20">
                                <input 
                                    className="flex-grow bg-transparent border-none focus:ring-0 px-4 text-[#171c23] placeholder:text-[#c4c7c7] font-medium outline-none" 
                                    placeholder="Enter your email" 
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    disabled={status === 'loading'}
                                />
                                <button 
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="bg-[#000000] text-[#ffffff] px-6 py-3 rounded-xl font-bold hover:scale-[1.03] transition-transform shadow-lg disabled:opacity-70"
                                >
                                    {status === 'loading' ? 'Processing...' : 'Join Waitlist'}
                                </button>
                            </form>
                        )}
                    </div>
                    
                    <p className="text-sm text-[#444748] flex items-center justify-center gap-2 mb-20 md:mb-32">
                        <span className="flex -space-x-2">
                            <span className="w-6 h-6 rounded-full bg-[#d0bcff] border-2 border-[#f8f9ff]"></span>
                            <span className="w-6 h-6 rounded-full bg-[#adc6ff] border-2 border-[#f8f9ff]"></span>
                            <span className="w-6 h-6 rounded-full bg-[#c8c6c5] border-2 border-[#f8f9ff]"></span>
                        </span>
                        <span className="font-medium text-[#000000]">⭐ Join 1,200+ early users</span>
                    </p>

                    {/* Hero Visual Canvas */}
                    <div className="relative max-w-5xl mx-auto mt-12 md:mt-24">
                        {/* Floating Mobile UI Mockup */}
                        <div className="relative z-10 mx-auto w-[320px] h-[650px] bg-white rounded-[3rem] p-4 shadow-2xl border-[8px] border-[#1c1b1b] overflow-hidden">
                            <div className="h-full bg-[#eff3fe] rounded-[2rem] overflow-hidden flex flex-col">
                                <div className="p-6 bg-white flex justify-between items-center">
                                    <div className="text-left">
                                        <p className="text-[10px] text-[#444748] uppercase tracking-widest font-bold">Total Balance</p>
                                        <h3 className="text-2xl font-extrabold ">₹1,42,000</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-[#dee2ed] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#000000]" data-icon="account_balance_wallet">account_balance_wallet</span>
                                    </div>
                                </div>
                                <div className="flex-grow p-4 space-y-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-xs font-bold ">Transactions</p>
                                            <span className="text-[10px] text-[#6b38d4] font-bold">View All</span>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                                    <span className="material-symbols-outlined text-sm" data-icon="restaurant">restaurant</span>
                                                </div>
                                                <div className="flex-grow text-left">
                                                    <p className="text-xs font-bold">Swiggy Delivery</p>
                                                    <p className="text-[10px] text-[#444748]">Food & Drinks</p>
                                                </div>
                                                <p className="text-xs font-bold text-[#ba1a1a]">-₹450</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <span className="material-symbols-outlined text-sm" data-icon="commute">commute</span>
                                                </div>
                                                <div className="flex-grow text-left">
                                                    <p className="text-xs font-bold">Uber Ride</p>
                                                    <p className="text-[10px] text-[#444748]">Transport</p>
                                                </div>
                                                <p className="text-xs font-bold text-[#ba1a1a]">-₹220</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                                    <span className="material-symbols-outlined text-sm" data-icon="payments">payments</span>
                                                </div>
                                                <div className="flex-grow text-left">
                                                    <p className="text-xs font-bold">Salary Credit</p>
                                                    <p className="text-[10px] text-[#444748]">Income</p>
                                                </div>
                                                <p className="text-xs font-bold text-green-600">+₹85,000</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-[#6b38d4] to-[#8455ef] p-4 rounded-xl text-white shadow-xl">
                                        <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold text-left">Monthly Budget</p>
                                        <div className="mt-2 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white w-2/3"></div>
                                        </div>
                                        <p className="mt-2 text-[10px] font-medium text-left">₹24,000 of ₹40,000 spent</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Insight Cards */}
                        <div className="hidden md:block absolute top-20 -left-20 glass-card p-5 rounded-xl shadow-2xl border border-white/50 w-64 text-left z-20 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-[#ffdad6] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#ba1a1a] text-lg" data-icon="warning" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
                                </div>
                                <p className="font-bold text-sm">High Spend Alert</p>
                            </div>
                            <p className="text-sm text-[#444748]">You spent <span className="font-bold text-[#000000]">₹4,200</span> on food this week.</p>
                        </div>
                        <div className="hidden md:block absolute bottom-40 -right-24 glass-card p-5 rounded-xl shadow-2xl border border-white/50 w-64 text-left z-20 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-[#3980f4]/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#3980f4] text-lg" data-icon="insights">insights</span>
                                </div>
                                <p className="font-bold text-sm">Weekly Insight</p>
                            </div>
                            <p className="text-sm text-[#444748]">You're <span className="font-bold text-[#6b38d4]">18% over budget</span> compared to last month.</p>
                        </div>
                        <div className="hidden md:block absolute -top-10 right-0 glass-card p-5 rounded-xl shadow-2xl border border-white/50 w-64 text-left z-20 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-[#dee2ed] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#000000] text-lg" data-icon="subscriptions">subscriptions</span>
                                </div>
                                <p className="font-bold text-sm">Subscription</p>
                            </div>
                            <p className="text-sm text-[#444748]">Netflix <span className="font-bold text-[#000000]">₹499/month</span> due tomorrow.</p>
                        </div>

                        {/* Decorative Blur Orbs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8455ef]/10 rounded-full blur-[100px] -z-10"></div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-20 md:py-32 bg-white mt-20 md:mt-0 relative z-30">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#444748] mb-12">Trusted by modern creators at</p>
                        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-24 opacity-40 grayscale contrast-125">
                            <img alt="Notion" className="h-8 object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqKaKE2E10jtsI4zYWxbg_smBgOI3jPqUdSeYpqk7Kz_uyxZ3AyiVvW4YHgUJxvZdnVjFi756VWYoAKpwtwtOmm_QrtL-kAxR8oH9ldpmtjVkUT4Xj2M_o-_WVLvTHRQPFjvrmFWPlPLQzUgKWd8xl_TwP3Jn9pavDcSJZt65BkxJnZkc-JfjkFdTiE3FmQhj7A5IDYmTsOSNNZxuhjxKWJTFODY37NJY00DjDECkp0ByUapRbtq5YUK5Un1hMJLdwb8ycGJNfVslp"/>
                            <img alt="Spotify" className="h-8 object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwFoT6gd4IXBCYk3eFN7UDw3dEgMlQG5sP0Q70tTvNjfe7Z0VSd7j3CVAcUajDKJtAheYnlnDPTeOSYpjSGusoJ6c-kPKWAKe6V8Tt7a5xlms67HoaFS3zrhSCIXsiTdcn3vmEU-5d1K6r40ZHNmAAskuUu_mtAsOZQIiCh_Wi_7oXCCtuVwgiNtxIOt1wex1Ids3AIxsHk4p4_XBRzZy61QFMI78eWhV6TNmyqi47z3O_E3YKeOp_rKyaMf1HwAEyLRLJAn7ydVhN"/>
                            <img alt="Webflow" className="h-6 object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx0XGw8-SnP3_qPm9SI8gOZ5kMOzpUZl36TXwpTeFZ4IRloep9KlqKPQpc9wioIEE50STz7Xn8YYH17oZwajDpXb6LllDy0Z4NMkX1fDEaZAqGlW6poTTotRNHY5CnhUJmG7aKaSDKglQbnIE_sbleHDxzxp0ytDdIfNFdacfwJ1B3Oxe5Q9_rM7Ilg0I8KTsKqjRR8-3zZ5mhsWZWiyMIRPbtF6AyWy0915vX3B2NkPmSUxyM92fvpgJsLF2vnR8AW2TV6XgHl7VL"/>
                            <img alt="Asana" className="h-6 object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvg2gOTO1JKVO4kb2ZXll9Amx-O7I-HUjFYpH-HU1-kgp4VQSYrw0ic_2KBG9KfY1DoMeFs85PmpSioD2E0qozwT8-HCyyiq-4Kj0s-Ogm59qAO7h0H6p7juO7B30KqANsqsCZAaf_2t4qbVGm5Hp_4fvzEvVI_4zEbBkE_RIcFSy-s33EALOOAH3Ad_b-eQcFx6VXHNT23pDgfpZhQ8D3N8qsUOIbuTCKHffycKVAYW4APuhxc-5ELpZoliKrZgSgWoWNCb7pdtwk"/>
                        </div>
                    </div>
                </section>

                {/* Bento Features Section */}
                <section id="features" className="py-24 max-w-7xl mx-auto px-6 scroll-mt-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 p-10 rounded-3xl bg-[#eff3fe] flex flex-col justify-between border border-[#eff3fe] hover:border-[#6b38d4]/20 transition-all group">
                            <div>
                                <h4 className="text-2xl md:text-3xl font-extrabold  mb-4 text-[#000000]">Zero Data Entry</h4>
                                <p className="text-[#444748] max-w-md text-lg">Connect your banks securely and let credU automatically categorize every transaction with 99% accuracy.</p>
                            </div>
                            <div className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-[#c4c7c7]/10 group-hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold text-sm text-[#000000]">Real-time Sync</span>
                                    <span className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full font-bold">Active</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-2 w-full bg-[#eaeef9] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#6b38d4] to-[#8455ef] w-3/4 rounded-full"></div>
                                    </div>
                                    <div className="h-2 w-full bg-[#eaeef9] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#6b38d4] to-[#8455ef] w-1/2 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 rounded-3xl bg-gradient-to-tr from-[#6b38d4] to-[#8455ef] text-[#ffffff] flex flex-col shadow-xl">
                            <span className="material-symbols-outlined text-4xl mb-8 opacity-90" data-icon="security" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
                            <h4 className="text-2xl font-extrabold  mb-4 leading-tight">Bank-Grade Security</h4>
                            <p className="opacity-90 leading-relaxed">AES-256 encryption. Read-only access. Your data never leaves our secure encrypted vault.</p>
                        </div>

                        <div className="p-10 rounded-3xl bg-white shadow-sm border border-[#c4c7c7]/10 flex flex-col justify-center hover:shadow-md transition-all">
                            <span className="material-symbols-outlined text-[#6b38d4] text-4xl mb-6">lightbulb</span>
                            <h4 className="text-2xl font-extrabold  mb-4 text-[#000000]">Smart Budgets</h4>
                            <p className="text-[#444748] leading-relaxed">We learn your habits and suggest dynamic budgets that actually work for your lifestyle effortlessly.</p>
                        </div>

                        <div className="md:col-span-2 p-10 rounded-3xl bg-[#dee2ed] flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden hover:bg-[#dee2ed]/80 transition-colors">
                            <div className="max-w-xs text-center md:text-left">
                                <h4 className="text-2xl font-extrabold  mb-4 text-[#000000]">Export Everywhere</h4>
                                <p className="text-[#444748] leading-relaxed">One-click export to CSV, PDF, or direct headless sync with Notion and modern Excel workflows.</p>
                            </div>
                            <div className="flex gap-4 md:-mr-20 mt-6 md:mt-0">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center rotate-[-5deg] hover:rotate-0 transition-transform">
                                    <span className="material-symbols-outlined text-3xl text-[#3980f4]" data-icon="description">description</span>
                                </div>
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center -translate-y-4 hover:-translate-y-6 transition-transform">
                                    <span className="material-symbols-outlined text-3xl text-emerald-500" data-icon="table_chart">table_chart</span>
                                </div>
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center rotate-[5deg] hover:rotate-0 transition-transform">
                                    <span className="material-symbols-outlined text-3xl text-[#6b38d4]" data-icon="sync">sync</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-10 mb-20 px-6 max-w-lg mx-auto">
                    <div className="glass-card border border-white/50 p-10 rounded-3xl text-center shadow-2xl">
                        <h2 className="text-3xl  font-extrabold text-[#000000] mb-6">Ready to evolve?</h2>
                        <button 
                            onClick={scrollToWaitlist}
                            className="w-full bg-[#8455ef] text-[#ffffff] h-14 rounded-xl  font-bold text-lg shadow-xl shadow-[#8455ef]/30 active:scale-95 transition-transform"
                        >
                            Get Early Access
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full py-12 border-t border-slate-200/50 bg-white">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6 text-center md:text-left">
                    <div className="flex flex-col gap-2 relative z-10">
                        <span className="text-lg font-bold text-slate-900  tracking-tighter">credU</span>
                        <p className=" text-sm leading-relaxed text-slate-500 mt-1">© 2024 credU Atelier. All rights reserved.</p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
                        <span className="text-slate-500  text-sm hover:text-[#000000] transition-colors cursor-pointer">Privacy Policy</span>
                        <span className="text-slate-500  text-sm hover:text-[#000000] transition-colors cursor-pointer">Terms of Service</span>
                        <span className="text-slate-500  text-sm hover:text-[#000000] transition-colors cursor-pointer">Cookie Settings</span>
                        <span className="text-slate-500  text-sm hover:text-[#000000] transition-colors cursor-pointer">Contact</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
