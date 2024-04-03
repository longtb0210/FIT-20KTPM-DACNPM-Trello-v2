import { createContext, useEffect, useState } from 'react'
import Keycloak from 'keycloak-js'

type AuthContext = {
  keycloak: Keycloak
  login: () => void
  logout: () => void
  isLoggedIn: boolean
}

export const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem('isLogin') || 'false'))
  const [keycloak, setKeycloak] = useState<Keycloak>(
    new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_AUTH_SERVER_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
    })
  )

  // useEffect(() => {
  //   const initializeKeycloak = async () => {
  //     try {
  //       await keycloak.init({
  //         onLoad: 'check-sso'
  //         // redirectUri: 'http://localhost:3000/login'
  //       })

  //       if (keycloak.authenticated) {
  //         localStorage.setItem('isLogin', JSON.stringify(true))
  //         localStorage.setItem('data', JSON.stringify(keycloak))
  //         localStorage.setItem('accessToken', keycloak.token || '')

  //         localStorage.setItem(
  //           'profile',
  //           JSON.stringify({
  //             name: `${keycloak.tokenParsed?.given_name || ''} ${keycloak.tokenParsed?.family_name || ''}`,
  //             email: keycloak.tokenParsed?.email || ''
  //           })
  //         )
  //         console.log('hê hê')

  //         setIsLoggedIn(true)
  //         setKeycloak(keycloak)
  //       } else {
  //         // setIsLoggedIn(false)
  //         // localStorage.setItem('isLogin', JSON.stringify(false))
  //         console.log('huhu')
  //       }
  //     } catch (error) {
  //       console.error('Failed to initialize Keycloak: ', error)
  //     }
  //   }

  //   if (!keycloak) {
  //     setKeycloak(
  //       new Keycloak({
  //         url: import.meta.env.VITE_KEYCLOAK_AUTH_SERVER_URL,
  //         realm: import.meta.env.VITE_KEYCLOAK_REALM,
  //         clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
  //       })
  //     )
  //   } else {
  //     initializeKeycloak()
  //   }
  // }, [keycloak])

  const login = () => {
    if (keycloak) {
      keycloak.login()
    }
  }

  const logout = () => {
    if (keycloak) {
      localStorage.clear()
      // setIsLoggedIn(false)
      keycloak.logout({ redirectUri: 'http://localhost:3000/login' })
    }
  }

  return (
    <AuthContext.Provider value={keycloak ? { keycloak, login, logout, isLoggedIn } : null}>
      {children}
    </AuthContext.Provider>
  )
}
