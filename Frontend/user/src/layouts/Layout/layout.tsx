import { Outlet, useLocation } from 'react-router'
import Header from '~/components/Header'
import { ThemeProvider } from '~/components/Theme/themeContext'

function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <ThemeProvider>
      {/* {!isLoginPage && <Header />} */}
      <div style={{ paddingTop: !isLoginPage ? '50px' : '0' }}>
        <Outlet />
      </div>
    </ThemeProvider>
  )
}

export default App
