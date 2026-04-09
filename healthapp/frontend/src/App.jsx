/**
 * METASCALE HEALTH: MAIN FRONTEND ORCHESTRATOR (BISECTION PHASE)
 * Purpose: Stripped version to isolate 'Silent Killer' component crash.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import LandingPage from './pages/landing/LandingPage';

/* 
 * BISECTION COOLDOWN
 * Logic: All complex route boundaries are temporarily disabled to find 
 * the module evaluation error.
 */

function App() {
  console.log('CLINICAL OS: App component evaluating');
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* SYSTEM FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
