/**
 * METASCALE HEALTH: CLINICAL OS ROOT (main.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * The primary entry point for the Clinical OS. It initializes the React 19 
 * environment, binds the 'Root' component (App), and injects the 'Metascale' 
 * design system (index.css).
 * 
 * ─── RENDER STRATEGY ────────────────────────────────────────────────────────
 * Implements a high-resilience mounting pattern using 'createRoot' from 
 * react-dom/client. Standardized to prevent 'ReferenceError: t' during 
 * production minification.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log('CLINICAL OS: PRODUCTION BUNDLE INITIALIZING');

try {
  const container = document.getElementById('root');
  if (!container) throw new Error('Root container missing');

  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('CLINICAL OS: MOUNT SUCCESSFUL');
} catch (error) {
  console.error('CLINICAL OS: RUNTIME FAILURE', error);
  // FALLBACK UI: Ensures the user is never left with a blank white screen.
  document.body.innerHTML = `
    <div style="padding: 40px; background: #141414; color: white; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
      <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #f7931e;">Critical System Fault</h1>
      <p style="opacity: 0.6; max-width: 400px; line-height: 1.6;">The Clinical OS encountered a runtime evaluation error. Please contact Metascale Support.</p>
      <code style="margin-top: 2rem; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">${error.message}</code>
    </div>
  `;
}
