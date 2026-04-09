/**
 * METASCALE HEALTH: MAIN FRONTEND ORCHESTRATOR
 * BISECTION PHASE 2: Isolating Portals
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// AUTHENTICATION PORTAL (CORE)
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// PATIENT PORTAL (BASE)
import PatientDashboard from './pages/patient/PatientDashboard';

// DOCTOR/ADMIN/ADVANCED PAGES ARE COMMENTED OUT TO ISOLATE THE CRASH
/*
import ScreeningPortal from './pages/patient/ScreeningPortal';
import LiverScreening from './pages/patient/LiverScreening';
import DiabetesScreening from './pages/patient/DiabetesScreening';
import PredictionResult from './pages/patient/PredictionResult';
import HistoryPage from './pages/patient/HistoryPage';
import PatientAppointments from './pages/patient/PatientAppointments';
import ProfilePage from './pages/shared/ProfilePage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientList from './pages/doctor/PatientList';
import PatientDetail from './pages/doctor/PatientDetail';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
*/

function App() {
  console.log('CLINICAL OS: App Bisection Phase 2 Evaluating');

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* PATIENT PORTAL (MINIMAL) */}
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route path="/patient/dashboard" element={<AppLayout><PatientDashboard /></AppLayout>} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
