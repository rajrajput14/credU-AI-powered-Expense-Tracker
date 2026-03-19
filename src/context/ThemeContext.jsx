import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // 1. Check localStorage
        const saved = localStorage.getItem('credu-theme')
        if (saved) return saved
        
        // 2. Check system preference
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light'
        }
        
        return 'dark'
    })

    useEffect(() => {
        const root = window.document.documentElement
        if (theme === 'light') {
            root.classList.add('light-theme')
        } else {
            root.classList.remove('light-theme')
        }
        localStorage.setItem('credu-theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within a ThemeProvider')
    return context
}
