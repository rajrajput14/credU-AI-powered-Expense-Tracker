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
import SplashScreen from './components/SplashScreen'
import { supabase, getCurrentUser } from './services/supabase'
import { useAppStore } from './store/useAppStore'

function App() {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [showSplash, setShowSplash] = useState(true)
  const { fetchInitialData, subscribeToDatabase, setUser: setGlobalUser } = useAppStore()

  useEffect(() => {
    let unsubscribe = null
    const startTime = Date.now()
    const MIN_SPLASH_TIME = 1500
    const { darkMode } = useAppStore.getState();

    // Initialize Dark Mode
    if (darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    const init = async () => {
      try {
        // 1. Check active session
        const u = await getCurrentUser()
        setUser(u)
        setGlobalUser(u)

        if (u) {
          // 2. Fetch initial data
          await fetchInitialData(u.id)
          unsubscribe = subscribeToDatabase(u.id)
        }

        // 3. Ensure minimum display time
        const elapsed = Date.now() - startTime
        const delay = Math.max(0, MIN_SPLASH_TIME - elapsed)

        setTimeout(() => {
          setInitializing(false)
          // Give a tiny buffer for the fadeout to start
          setTimeout(() => setShowSplash(false), 100)
        }, delay)

      } catch (err) {
        console.error("Init Error:", err)
        setInitializing(false)
        setShowSplash(false)
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

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" />
      ) : (
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
              </Route>
            </Routes>
          </Router>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
