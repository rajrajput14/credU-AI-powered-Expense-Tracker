import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import * as subscriptionService from '../services/subscriptionService';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, createCheckout, isPro } = useAppStore();
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            q: "How accurate is the voice tracking?",
            a: "Our NLP engine has 99.2% accuracy in identifying amounts, currencies, and categories across various accents and naturally spoken sentences."
        },
        {
            q: "Is my banking data secure?",
            a: "We use bank-level AES-256 encryption. We utilize read-only tokens through trusted partners like Plaid, so we never have access to your money, only the data."
        },
        {
            q: "Can I use credU in multiple currencies?",
            a: "Yes! credU automatically detects the currency you mention or uses your location to convert expenses to your primary \"home\" currency using mid-market rates."
        },
        {
            q: "Does it work offline?",
            a: "Offline entries are saved locally and synced automatically as soon as you are back online. You'll never miss an expense."
        },
        {
            q: "What is the pricing model?",
            a: "We offer a generous free tier for manual and limited voice tracking. Our Pro plan includes full bank sync and advanced AI insights for a small monthly fee."
        }
    ];

    const handleGetStarted = () => {
        if (user) {
            navigate('/app-dashboard');
        } else {
            navigate('/auth');
        }
    };

    return (
        <div className="bg-surface font-body text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
            {/* Navigation Header */}
            <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-lg shadow-sm">
                <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto">
                    <div className="font-headline text-2xl font-bold text-on-surface">credU</div>
                    <div className="hidden md:flex items-center gap-8">
                        <a className="text-primary font-semibold border-b-2 border-primary text-sm tracking-tight" href="#">Features</a>
                        <a className="text-on-surface-variant hover:text-on-surface transition-all text-sm tracking-tight" href="#">How it Works</a>
                        <a className="text-on-surface-variant hover:text-on-surface transition-all text-sm tracking-tight" href="#">Pricing</a>
                        <a className="text-on-surface-variant hover:text-on-surface transition-all text-sm tracking-tight" href="#">Security</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/auth')}
                            className="px-4 md:px-5 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-all rounded-full"
                        >
                            Login
                        </button>
                        <button 
                            onClick={handleGetStarted}
                            className="fluid-gradient text-white px-5 md:px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:opacity-90 transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-24">
                {/* Hero Section */}
                <section className="relative px-6 md:px-8 pt-12 md:pt-20 pb-20 md:pb-32 overflow-hidden">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
                        <div className="z-10 text-center lg:text-left">
                            <motion.span 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider mb-6"
                            >
                                Introducing credU AI 2.0
                            </motion.span>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-headline text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
                            >
                                You don’t need another expense tracker. <span className="text-primary">You need control.</span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-on-surface-variant text-lg md:text-xl mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0"
                            >
                                AI-powered expense tracking that shows where your money goes—and how to fix it.
                            </motion.p>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <button 
                                    onClick={handleGetStarted}
                                    className="fluid-gradient text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform"
                                >
                                    Get Started
                                </button>
                                <button className="bg-surface-container-lowest text-on-surface px-8 py-4 rounded-full text-lg font-bold soft-glow border border-outline-variant/15 hover:bg-surface-container-low transition-all">
                                    Book a Demo
                                </button>
                            </motion.div>
                        </div>

                        {/* Visual: Mobile Mockup */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
                            <div className="relative w-64 md:w-72 h-[520px] md:h-[580px] bg-on-surface rounded-[2.5rem] md:rounded-[3rem] p-2 md:p-3 shadow-2xl overflow-hidden border-[6px] md:border-[8px] border-on-surface">
                                <div className="w-full h-full bg-surface-bright rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden flex flex-col">
                                    {/* App Header */}
                                    <div className="p-5 md:p-6 bg-white border-b border-surface-container">
                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Total Balance</p>
                                        <p className="text-xl md:text-2xl font-bold text-on-surface">₹48,250.00</p>
                                    </div>
                                    {/* App List */}
                                    <div className="p-4 space-y-3">
                                        <div className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-tertiary-container/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-sm text-tertiary">restaurant</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold">Food</p>
                                                    <p className="text-[10px] text-on-surface-variant">Today, 2:30 PM</p>
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-error">-₹250</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-sm text-primary">subscriptions</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold">Netflix</p>
                                                    <p className="text-[10px] text-on-surface-variant">Subscription</p>
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-error">-₹499</p>
                                        </div>
                                    </div>
                                    {/* Glass Feedback inside Mockup */}
                                    <div className="mt-auto p-4">
                                        <div className="glass-card p-3 rounded-xl border border-white/40 shadow-sm">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="material-symbols-outlined text-primary text-xs">insights</span>
                                                <span className="text-[8px] font-bold text-primary uppercase">Wealth Insight</span>
                                            </div>
                                            <p className="text-[10px] font-medium text-on-surface">You spent 20% more today compared to last week.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-16 md:py-20 bg-surface-container-low/30 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <p className="text-sm font-medium text-on-surface-variant/60 uppercase tracking-widest mb-12">Trusted by modern professionals</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-24 opacity-40 grayscale">
                            <span className="text-2xl font-bold font-headline">Notion</span>
                            <span className="text-2xl font-bold font-headline">Spotify</span>
                            <span className="text-2xl font-bold font-headline">Webflow</span>
                            <span className="text-2xl font-bold font-headline">Gumroad</span>
                            <span className="text-2xl font-bold font-headline">Asana</span>
                        </div>
                    </div>
                </section>

                {/* Features Section (Bento Grid Style) */}
                <section className="py-20 md:py-32 px-6 md:px-8 max-w-7xl mx-auto">
                    <div className="mb-16 md:mb-20">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Features for the Future of Finance</h2>
                        <p className="text-on-surface-variant text-lg">Built to be as fast as your spending.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Voice Entry */}
                        <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-2xl soft-glow border border-outline-variant/10 relative overflow-hidden flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-primary">mic</span>
                                </div>
                                <h3 className="font-headline text-2xl font-bold mb-3">Voice Expense Entry</h3>
                                <p className="text-on-surface-variant leading-relaxed">Just say "Spent ₹500 on dinner at Joey's" and credU handles the rest. No more manual data entry.</p>
                            </div>
                            <div className="mt-8 p-4 bg-surface rounded-xl border border-outline-variant/20 inline-flex items-center gap-3 w-fit">
                                <div className="flex gap-1">
                                    <div className="w-1 h-4 bg-primary rounded-full animate-pulse"></div>
                                    <div className="w-1 h-6 bg-primary rounded-full animate-pulse"></div>
                                    <div className="w-1 h-4 bg-primary rounded-full animate-pulse"></div>
                                </div>
                                <span className="text-xs font-medium text-primary uppercase tracking-wider">Processing voice...</span>
                            </div>
                        </div>
                        {/* Smart Insights */}
                        <div className="bg-surface-container-lowest p-8 rounded-2xl soft-glow border border-outline-variant/10">
                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-secondary">psychology</span>
                            </div>
                            <h3 className="font-headline text-2xl font-bold mb-3">Smart Insights</h3>
                            <p className="text-on-surface-variant">Our AI identifies recurring patterns and suggests where you can save up to 15% monthly.</p>
                        </div>
                        {/* Real-Time Tracking */}
                        <div className="bg-surface-container-lowest p-8 rounded-2xl soft-glow border border-outline-variant/10">
                            <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-tertiary">bolt</span>
                            </div>
                            <h3 className="font-headline text-2xl font-bold mb-3">Real-Time Tracking</h3>
                            <p className="text-on-surface-variant">Sync with your bank for instant updates. Watch your net worth grow in real-time.</p>
                        </div>
                        {/* Goal Planning */}
                        <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-2xl soft-glow border border-outline-variant/10">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1">
                                    <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center mb-6">
                                        <span className="material-symbols-outlined text-error">target</span>
                                    </div>
                                    <h3 className="font-headline text-2xl font-bold mb-3">Goal Planning</h3>
                                    <p className="text-on-surface-variant">Whether it’s a vacation or a new home, we help you set milestones and stick to them.</p>
                                </div>
                                <div className="w-full md:w-64 bg-surface p-6 rounded-22xl border border-outline-variant/10">
                                    <p className="text-xs font-bold mb-2">New Macbook Pro</p>
                                    <div className="flex justify-between text-xs mb-1 font-medium">
                                        <span>₹85,000 / ₹1,20,000</span>
                                        <span className="text-primary font-bold">70%</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                                        <div className="w-[70%] h-full fluid-gradient"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Secure & Private */}
                        <div className="bg-primary px-8 py-10 rounded-2xl shadow-xl flex flex-col justify-between text-white md:col-span-3 lg:col-span-1">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined">shield</span>
                                </div>
                                <h3 className="font-headline text-2xl font-bold mb-3">Secure & Private</h3>
                                <p className="text-white/80 leading-relaxed">Bank-grade 256-bit encryption. Your data is yours alone. We never sell your personal information.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 md:py-32 bg-white px-6 md:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12 md:16 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div 
                                    key={index}
                                    className="group p-6 rounded-2xl border border-outline-variant/15 hover:border-primary/30 transition-all bg-surface cursor-pointer"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <h4 className="font-bold text-lg flex justify-between items-center text-on-surface">
                                        {faq.q}
                                        <span className={`material-symbols-outlined transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>expand_more</span>
                                    </h4>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.p 
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                className="text-on-surface-variant overflow-hidden"
                                            >
                                                {faq.a}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 md:py-24 px-6 md:px-8">
                    <div className="max-w-7xl mx-auto fluid-gradient rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-24 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <h2 className="font-headline text-3xl md:text-6xl font-bold mb-8 relative z-10 leading-[1.1]">Take control of your money today</h2>
                        <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto relative z-10">Join 50,000+ professionals using credU to build real wealth.</p>
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center relative z-10">
                            <button 
                                onClick={handleGetStarted}
                                className="bg-white text-primary px-10 py-5 rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform"
                            >
                                Get Started for Free
                            </button>
                            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full text-xl font-bold hover:bg-white/20 transition-all text-sm md:text-xl">
                                Schedule Demo
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-slate-200 bg-slate-50 mt-12 md:mt-20">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8 px-6 md:px-8 py-16 max-w-7xl mx-auto">
                    <div className="col-span-2">
                        <div className="font-headline text-2xl font-bold text-on-surface mb-6">credU</div>
                        <p className="text-on-surface-variant text-sm max-w-xs mb-8">AI-powered financial clarity for the modern professional. Built for humans, powered by machine intelligence.</p>
                        <div className="flex gap-4">
                            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                                <span className="material-symbols-outlined text-sm">public</span>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                                <span className="material-symbols-outlined text-sm">mail</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-widest text-on-surface mb-6">Product</h5>
                        <ul className="space-y-4 text-sm text-on-surface-variant">
                            <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Security</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-widest text-on-surface mb-6">Company</h5>
                        <ul className="space-y-4 text-sm text-on-surface-variant">
                            <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-widest text-on-surface mb-6">Legal</h5>
                        <ul className="space-y-4 text-sm text-on-surface-variant">
                            <li><a className="hover:text-primary transition-colors" href="#">Privacy</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-8 py-8 border-t border-surface-container">
                    <p className="font-body text-xs text-on-surface-variant/60 tracking-wider">© 2024 credU. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
