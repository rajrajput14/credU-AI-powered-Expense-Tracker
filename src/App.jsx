import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Transactions from './pages/Transactions'
import Goals from './pages/Goals'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Settings from './pages/Settings'
import LandingPage from './pages/LandingPage'
import Support from './pages/Support'
import Success from './pages/Success'
import { supabase, getCurrentUser } from './services/supabase'
import { useAppStore } from './store/useAppStore'
import { SplashScreen as CapacitorSplash } from '@capacitor/splash-screen'
import SplashScreen from './components/SplashScreen'
import { AnimatePresence } from 'framer-motion'
import { LiveUpdateService } from './services/LiveUpdateService'

function App() {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [showSplash, setShowSplash] = useState(true)
  const { fetchInitialData, subscribeToDatabase, setUser: setGlobalUser, initTheme } = useAppStore()
  
  useEffect(() => {
    let unsubscribe = null
    
    // Initialize Theme System
    initTheme();

    // Initialize OTA Updates
    LiveUpdateService.init();

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

    // Minimum splash time (3 seconds)
    const timer = setTimeout(() => {
        setShowSplash(false)
        // Hide native splash if mobile
        try {
            CapacitorSplash.hide()
        } catch (e) {
            // Not on mobile, ignore
        }
    }, 3000)

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
      clearTimeout(timer)
    }
  }, [])


  return (
    <div className="min-h-screen bg-surface">
        <AnimatePresence mode="wait">
            {showSplash || initializing ? (
                <SplashScreen key="splash" />
            ) : (
                <motion.div
                    key="app"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="min-h-screen"
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
                            <Route path="/success" element={<Success />} />
                        </Routes>
                    </Router>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  )
}

export default App
