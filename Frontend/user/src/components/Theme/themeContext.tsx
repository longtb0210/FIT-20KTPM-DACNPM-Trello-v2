import React, { createContext, useState, useContext } from 'react'
import { lightColors, darkColors } from '~/styles/colors'

interface ThemeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
  colors: typeof lightColors | typeof darkColors
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode') || 'false'))

  const colors = darkMode ? darkColors : lightColors

  const toggleDarkMode = () => {
    const a = !darkMode
    localStorage.setItem('darkMode', a.toString())
    setDarkMode(!darkMode)
  }

  const value = { darkMode, toggleDarkMode, colors }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
