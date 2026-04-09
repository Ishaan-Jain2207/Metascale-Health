import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/**
 * METASCALE CLINICAL OS: HYDRATION ENGINE
 * Purpose: Matches user reference logic exactly, but uses named imports 
 * to prevent production minification crashes.
 */
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
