import './index.css'
import { store } from './store'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Thay đổi ở đây
// import { router } from './routes/index.tsx'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { AuthProvider } from './components/AuthProvider/AuthProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
)
