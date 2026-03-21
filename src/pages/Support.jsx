import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { supportService } from '../services/supportService';
import { playSuccessSound, playErrorSound, playListeningStart } from '../services/audioService';

const Support = () => {
    const navigate = useNavigate();
    const { user } = useAppStore();
    const [faqs, setFaqs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [searchPlaceholder, setSearchPlaceholder] = useState('Search for help...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await supportService.fetchFAQs();
                setFaqs(data);
            } catch (error) {
                console.error('Error loading FAQs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();

        // Subscribe to ticket status changes
        let unsubscribe = null;
        if (user) {
            const channel = supportService.subscribeToTickets(user.id, (payload) => {
                alert(`Ticket status updated to: ${payload.status}`);
            });
            unsubscribe = () => channel.unsubscribe();
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateTicket = async (type) => {
        if (!user) return;
        try {
            const message = type === 'chat' ? 'I need help with my account' : 'Reported a problem with the app';
            await supportService.createTicket(user.id, message, type);
            playSuccessSound();
            alert(type === 'chat' ? 'Chat initiated! One of our agents will be with you shortly.' : 'Issue reported successfully. We will look into it.');
        } catch (error) {
            console.error('Error creating ticket:', error);
            playErrorSound();
            alert('Something went wrong. Please try again.');
        }
    };

    const toggleVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        if (isListening) {
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            playListeningStart();
            setSearchPlaceholder('Listening...');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            setSearchPlaceholder('Search for help...');
            setIsListening(false);
        };

        recognition.onerror = () => {
            setIsListening(false);
            setSearchPlaceholder('Something went wrong...');
            playErrorSound();
            setTimeout(() => setSearchPlaceholder('Search for help...'), 2000);
        };

        recognition.onend = () => {
            setIsListening(false);
            setSearchPlaceholder('Search for help...');
        };

        recognition.start();
    };

    return (
        <div className="bg-surface font-body text-on-surface antialiased min-h-screen pb-28 relative">
            {/* TopAppBar */}
            <header className="fixed top-0 w-full z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm shadow-indigo-500/5 flex items-center justify-between px-6 py-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="text-indigo-600 dark:text-indigo-400 active:scale-95 duration-200 transition-opacity hover:opacity-80"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-['Manrope'] font-semibold text-lg tracking-tight text-on-surface">Support</h1>
                <button className="text-indigo-600 dark:text-indigo-400 active:scale-95 duration-200 transition-opacity hover:opacity-80">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </header>

            <main className="pt-24 px-6 space-y-8 max-w-md mx-auto">
                {/* Search Section */}
                <section className="space-y-4">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">search</span>
                        <input 
                            className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-body-md placeholder:text-outline-variant transition-all shadow-sm"
                            placeholder={searchPlaceholder}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </section>

                {/* Quick Actions Grid */}
                <section className="grid grid-cols-2 gap-4">
                    <div 
                        onClick={() => handleCreateTicket('chat')}
                        className="p-5 bg-surface-container-lowest rounded-lg shadow-sm flex flex-col items-start space-y-3 active:scale-95 transition-transform duration-200 cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">chat</span>
                        </div>
                        <div>
                            <h3 className="font-headline font-semibold text-sm">Contact Support</h3>
                            <p className="text-xs text-on-surface-variant leading-tight mt-1">Get help from our team</p>
                        </div>
                    </div>
                    <div 
                        onClick={() => handleCreateTicket('issue')}
                        className="p-5 bg-surface-container-lowest rounded-lg shadow-sm flex flex-col items-start space-y-3 active:scale-95 transition-transform duration-200 cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
                            <span className="material-symbols-outlined">report_problem</span>
                        </div>
                        <div>
                            <h3 className="font-headline font-semibold text-sm">Report a Problem</h3>
                            <p className="text-xs text-on-surface-variant leading-tight mt-1">Something not working?</p>
                        </div>
                    </div>
                    <div className="p-5 bg-surface-container-lowest rounded-lg shadow-sm flex flex-col items-start space-y-3 active:scale-95 transition-transform duration-200">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined">help</span>
                        </div>
                        <div>
                            <h3 className="font-headline font-semibold text-sm">FAQs</h3>
                            <p className="text-xs text-on-surface-variant leading-tight mt-1">Find quick answers</p>
                        </div>
                    </div>
                    <div className="p-5 bg-surface-container-lowest rounded-lg shadow-sm flex flex-col items-start space-y-3 active:scale-95 transition-transform duration-200">
                        <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                            <span className="material-symbols-outlined">book</span>
                        </div>
                        <div>
                            <h3 className="font-headline font-semibold text-sm">App Guide</h3>
                            <p className="text-xs text-on-surface-variant leading-tight mt-1">Learn how to use credU</p>
                        </div>
                    </div>
                </section>

                {/* Voice Help Card Removed Per User Request */}

                {/* FAQ Section */}
                <section className="space-y-4">
                    <h2 className="font-headline font-semibold text-lg px-2">Popular Questions</h2>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="p-10 flex justify-center"><div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div></div>
                        ) : filteredFaqs.length > 0 ? (
                            filteredFaqs.map(faq => (
                                <div key={faq.id} className="bg-surface-container-lowest rounded-md overflow-hidden transition-all shadow-sm">
                                    <div 
                                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                        className="p-5 flex justify-between items-center group active:bg-surface-container-low transition-colors cursor-pointer"
                                    >
                                        <span className="font-medium text-body-md text-on-surface">{faq.question}</span>
                                        <motion.span 
                                            animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
                                            className="material-symbols-outlined text-outline group-hover:text-primary transition-colors"
                                        >
                                            expand_more
                                        </motion.span>
                                    </div>
                                    <AnimatePresence>
                                        {expandedFaq === faq.id && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-5 pb-5 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/5 pt-3"
                                            >
                                                {faq.answer}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-on-surface-variant/60 text-sm bg-surface-container-lowest rounded-lg border border-dashed border-outline-variant/20 italic">
                                No matching questions found...
                            </div>
                        )}
                    </div>
                </section>

                {/* Contact Support Card */}
                <section className="bg-surface-container-low p-8 rounded-lg text-center space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-headline font-bold text-xl">Still need help?</h3>
                        <p className="text-on-surface-variant text-sm px-4">Our support team usually responds within a few hours during business days.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => handleCreateTicket('chat')}
                            className="bg-fluid-gradient text-on-primary font-semibold py-4 px-8 rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            Chat with us
                        </button>
                        <a 
                            href="mailto:support@credu.app"
                            className="bg-white text-primary font-semibold py-4 px-8 rounded-full border border-primary/10 active:scale-95 transition-all text-center block"
                        >
                            Email support
                        </a>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center py-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-outline">Version 1.0 • credU Support</p>
                </footer>
            </main>

            {/* BottomNavBar */}
            <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[32px] lg:hidden">
                <div onClick={() => navigate('/app-dashboard')} className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:text-indigo-500 transition-colors active:scale-90 duration-150 cursor-pointer">
                    <span className="material-symbols-outlined">home</span>
                    <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider mt-1">Home</span>
                </div>
                <div onClick={() => navigate('/app-dashboard/goals')} className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:text-indigo-500 transition-colors active:scale-90 duration-150 cursor-pointer">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider mt-1">Wealth</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-2xl px-5 py-2 active:scale-90 duration-150">
                    <span className="material-symbols-outlined font-variation-fill">contact_support</span>
                    <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider mt-1">Support</span>
                </div>
                <div onClick={() => navigate('/app-dashboard/settings')} className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:text-indigo-500 transition-colors active:scale-90 duration-150 cursor-pointer">
                    <span className="material-symbols-outlined">person</span>
                    <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider mt-1">Profile</span>
                </div>
            </nav>
        </div>
    );
};

export default Support;
