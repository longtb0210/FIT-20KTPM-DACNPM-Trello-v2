import { createContext, useEffect, useRef, useState } from 'react'
import Keycloak from 'keycloak-js'

type AuthContext = {
  keycloak: Keycloak | undefined
  login: () => void
  logout: () => void
  isLoggedIn: boolean
}

export const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const keycloak = useRef<Keycloak>()

  useEffect(() => {
    console.log(keycloak.current)
    if (keycloak.current) {
      return console.log('Init òi')
    }
    try {
      keycloak.current = new Keycloak({
        url: import.meta.env.VITE_KEYCLOAK_AUTH_SERVER_URL,
        realm: import.meta.env.VITE_KEYCLOAK_REALM,
        clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
      })
      keycloak.current.init({ onLoad: 'check-sso' }).then((success) => {
        setIsLoggedIn(success)
      })
    } catch (e) {
      console.warn(e)
    }
  }, [])

  const login = () => {
    if (keycloak.current) {
      keycloak.current.login({ redirectUri: 'http://localhost:3000/login' })
    } else {
      console.warn('Missing keycloak')
    }
  }

  const logout = () => {
    if (keycloak.current) {
      keycloak.current.logout({ redirectUri: 'http://localhost:3000/login' })
    } else {
      console.warn('Missing keycloak')
    }
  }

  return (
    <AuthContext.Provider value={{ keycloak: keycloak.current, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}
