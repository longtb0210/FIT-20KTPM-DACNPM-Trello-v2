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
      url: 'https://20127047-keycloak-trello.azurewebsites.net',
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
    })
  )

  useEffect(() => {
    const initializeKeycloak = async () => {
      try {
        await keycloak.init({
          onLoad: 'check-sso'
        })

        if (keycloak.authenticated) {
          localStorage.setItem('isLogin', JSON.stringify(true))
          localStorage.setItem('data', JSON.stringify(keycloak))
          console.log('hê hê')

          setIsLoggedIn(true)
          setKeycloak(keycloak)
        } else {
          setIsLoggedIn(false)
          localStorage.setItem('isLogin', JSON.stringify(false))
          console.log('huhu')
        }
      } catch (error) {
        console.error('Failed to initialize Keycloak: ', error)
      }
    }

    if (!keycloak) {
      setKeycloak(
        new Keycloak({
          url: import.meta.env.VITE_KEYCLOAK_AUTH_SERVER_URL,
          realm: import.meta.env.VITE_KEYCLOAK_REALM,
          clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
        })
      )
    } else {
      initializeKeycloak()
    }
  }, [keycloak])

  // useEffect(() => {
  //   // Kiểm tra thời hạn của token sau khi Keycloak được khởi tạo
  //   if (keycloak && keycloak.token) {
  //     const isTokenExpired = (): boolean => {
  //       try {
  //         const decodedToken: any = jwt_decode(keycloak.token)
  //         const expirationTime = decodedToken.exp * 1000 // Chuyển đổi từ giây sang mili giây
  //         const currentTime = Date.now()
  //         return expirationTime < currentTime
  //       } catch (error) {
  //         console.error('Failed to decode token:', error)
  //         return true
  //       }
  //     }

  //     if (isTokenExpired()) {
  //       // Token đã hết hạn, đăng xuất người dùng
  //       logout()
  //     }
  //   }
  // }, [keycloak])

  const login = () => {
    if (keycloak) {
      keycloak.login({ redirectUri: 'http://localhost:3000/login' })
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
