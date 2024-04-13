import Keycloak from 'keycloak-js'
import { createContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { TokenSlice } from '~/store/reducers'

type AuthContext = {
  keycloak: Keycloak | undefined
  login: () => void
  logout: () => void
  isLoggedIn: boolean
}

export const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
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
    }
    keycloak.current
      .init({
        // redirectUri: 'http://localhost:3000/login',
        onLoad: 'check-sso'
      })
      .then((success) => {
        setIsLoggedIn(success)
        if (success) {
          if (keycloak.current) {
            keycloak.current
              .loadUserProfile()
              .then((profile) => {
                const email = profile.email
                const name = profile.firstName + ' ' + profile.lastName

                localStorage.setItem('profile', JSON.stringify({ email, name }))
              })
              .catch((error) => {
                // Xử lý lỗi nếu có
                console.error('Error loading user profile:', error)
              })
          }

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
