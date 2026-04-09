/**
 * ROOT ENTRY POINT
 * Purpose: Hydrates the React tree into the DOM and initializes global styles.
 * Logic: 
 *   - Binds the 'App' orchestrator to the primary 'root' container.
 *   - Enforces 'React.StrictMode' for development-time sanity checks.
 *   - Injects the 'index.css' design system (Glassmorphism & Clinical aesthetics).
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

