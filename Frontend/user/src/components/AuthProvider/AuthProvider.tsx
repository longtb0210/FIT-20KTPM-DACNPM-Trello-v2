import { createContext, useEffect, useRef, useState } from 'react'
import Keycloak from 'keycloak-js'
import { TokenSlice } from '~/store/reducers'
import { useDispatch } from 'react-redux'

type AuthContext = {
  keycloak: Keycloak | undefined
  login: () => void
  logout: () => void
  isLoggedIn: boolean
}

export const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem('isLogin') || 'false'))
  const keycloak = useRef<Keycloak>()
  const dispatch = useDispatch()
  useEffect(() => {
    if (keycloak.current) return console.log('Keycloak already created')
    keycloak.current = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_AUTH_SERVER_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
    })
    keycloak.current.onAuthSuccess = () => {
      dispatch(TokenSlice.actions.setToken(keycloak.current?.token || ''))

      // localStorage.setItem('isLogin', JSON.stringify(true))
    }
    keycloak.current
      .init({
        redirectUri: 'http://localhost:3000/login',
        onLoad: 'check-sso'
      })
      .then((success) => {
        setIsLoggedIn(success)
        if (success) {
          console.log('Redirect to normal page')
        }
      })
  }, [])

  const login = () => {
    if (keycloak.current) {
      keycloak.current.login({ redirectUri: 'http://localhost:3000/login' })
    }
  }

  const logout = () => {
    if (keycloak.current) {
      localStorage.clear()
      keycloak.current.logout({ redirectUri: 'http://localhost:3000/login' })
    }
  }

  return (
    <AuthContext.Provider value={{ keycloak: keycloak.current, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}
