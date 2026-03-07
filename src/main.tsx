import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { restoreRedirectedPath } from './siteRoutes'
import './styles/style.css'

restoreRedirectedPath()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
