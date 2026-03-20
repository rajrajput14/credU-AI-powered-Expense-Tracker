import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Transactions from './pages/Transactions'
import Goals from './pages/Goals'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Settings from './pages/Settings'
import LandingPage from './pages/LandingPage'
import Support from './pages/Support'
import { supabase, getCurrentUser } from './services/supabase'
import { useAppStore } from './store/useAppStore'

function App() {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const { fetchInitialData, subscribeToDatabase, setUser: setGlobalUser } = useAppStore()

  useEffect(() => {
    let unsubscribe = null
    const { darkMode } = useAppStore.getState();

    // Initialize Dark Mode
    if (darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    const init = async () => {
      try {
        const u = await getCurrentUser()
        setUser(u)
        setGlobalUser(u)

        if (u) {
          await fetchInitialData(u.id)
          unsubscribe = subscribeToDatabase(u.id)
        }
        setInitializing(false)
      } catch (err) {
        console.error("Init Error:", err)
        setInitializing(false)
      }
    }

    init()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null
      setUser(u)
      setGlobalUser(u)
      
      if (unsubscribe) unsubscribe()
      
      if (u) {
        fetchInitialData(u.id)
        unsubscribe = subscribeToDatabase(u.id)
      }
    })

    return () => {
      subscription.unsubscribe()
      if (unsubscribe) unsubscribe()
    }
  }, [])

  if (initializing) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        {/* Simple loader if needed while initializing */}
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
        <motion.div
          key="app"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="min-h-screen bg-surface"
        >
          <Router>
            <Routes>
              <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/app-dashboard" />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/app-dashboard" element={user ? <Layout /> : <Navigate to="/auth" />}>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="goals" element={<Goals />} />
                <Route path="settings" element={<Settings />} />
                <Route path="support" element={<Support />} />
              </Route>
            </Routes>
          </Router>
        </motion.div>
    </AnimatePresence>
  )
}

export default App
