/**
 * METASCALE HEALTH: MAIN FRONTEND ORCHESTRATOR
 * Purpose: Defines the global application structure, routing tables, and security boundaries.
 * Architecture Logic: 
 *   - Utilizes 'AuthProvider' to maintain a persistent security context.
 *   - Implements 'ProtectedRoute' wrappers to enforce Role-Based Access Control (RBAC).
 *   - Maps virtual routes to specialized clinical portals (Patient, Doctor, Admin).
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// ─── AUTHENTICATION PORTAL ────────────────────────────────────────────────
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// ─── PATIENT PORTAL PORTFOLIO ───────────────────────────────────────────
import PatientDashboard from './pages/patient/PatientDashboard';
import ScreeningPortal from './pages/patient/ScreeningPortal';
import LiverScreening from './pages/patient/LiverScreening';
import DiabetesScreening from './pages/patient/DiabetesScreening';
import PredictionResult from './pages/patient/PredictionResult';
import HistoryPage from './pages/patient/HistoryPage';
import PatientAppointments from './pages/patient/PatientAppointments';
import ProfilePage from './pages/shared/ProfilePage';

// ─── CLINICAL (DOCTOR) PORTAL PORTFOLIO ─────────────────────────────────
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientList from './pages/doctor/PatientList';
import PatientDetail from './pages/doctor/PatientDetail';
import DoctorAppointments from './pages/doctor/DoctorAppointments';

// ─── SYSTEM ADMINISTRATION PORTFOLIO ────────────────────────────────────
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorManagement from './pages/admin/DoctorManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 
            PUBLIC BOUNDARY
            Logic: Open routes accessible to all identities, including visitors.
          */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 
            PATIENT BOUNDARY (RBAC: PATIENT)
            Security Logic: Requires authenticated 'patient' role context.
          */}
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route path="/patient/dashboard" element={<AppLayout><PatientDashboard /></AppLayout>} />
            <Route path="/patient/screening" element={<AppLayout><ScreeningPortal /></AppLayout>} />
            <Route path="/patient/screening/liver" element={<AppLayout><LiverScreening /></AppLayout>} />
            <Route path="/patient/screening/diabetes" element={<AppLayout><DiabetesScreening /></AppLayout>} />
            <Route path="/patient/screening/result" element={<AppLayout><PredictionResult /></AppLayout>} />
            <Route path="/patient/history" element={<AppLayout><HistoryPage /></AppLayout>} />
            <Route path="/patient/history/detail/:type/:id" element={<AppLayout><PredictionResult /></AppLayout>} />
            <Route path="/patient/appointments" element={<AppLayout><PatientAppointments /></AppLayout>} />
            <Route path="/patient/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
          </Route>

          {/* 
            CLINICAL BOUNDARY (RBAC: DOCTOR)
            Security Logic: Restricted to verified healthcare practitioners.
          */}
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor/dashboard" element={<AppLayout><DoctorDashboard /></AppLayout>} />
            <Route path="/doctor/patients" element={<AppLayout><PatientList /></AppLayout>} />
            <Route path="/doctor/patients/:id" element={<AppLayout><PatientDetail /></AppLayout>} />
            <Route path="/doctor/appointments" element={<AppLayout><DoctorAppointments /></AppLayout>} />
            <Route path="/doctor/analytics" element={<AppLayout><AdminDashboard /></AppLayout>} />
            <Route path="/doctor/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
          </Route>

          {/* 
            ADMINISTRATIVE BOUNDARY (RBAC: ADMIN)
            Security Logic: System-level governance and diagnostic oversight.
          */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AppLayout><AdminDashboard /></AppLayout>} />
            <Route path="/admin/doctors" element={<AppLayout><DoctorManagement /></AppLayout>} />
            <Route path="/admin/analytics" element={<AppLayout><AdminDashboard /></AppLayout>} />
            <Route path="/admin/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
          </Route>

          {/* 
            SYSTEM FALLBACK
            Logic: Silently redirects undefined routes to the clinical landing page.
          */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

