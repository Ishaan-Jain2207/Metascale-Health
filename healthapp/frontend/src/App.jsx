import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// ─── LAZY PAGE IMPORTS ────────────────────────────────────────────────────────
// Each page is loaded only when needed. This prevents the entire bundle from
// crashing if one module has a minification issue, and fixes the chunk-too-large
// warning on Vercel.

// Auth Pages
const LandingPage   = lazy(() => import('./pages/LandingPage'));
const LoginPage     = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage  = lazy(() => import('./pages/auth/RegisterPage'));

// Patient Pages
const PatientDashboard   = lazy(() => import('./pages/patient/PatientDashboard'));
const ScreeningPortal    = lazy(() => import('./pages/patient/ScreeningPortal'));
const LiverScreening     = lazy(() => import('./pages/patient/LiverScreening'));
const DiabetesScreening  = lazy(() => import('./pages/patient/DiabetesScreening'));
const PredictionResult   = lazy(() => import('./pages/patient/PredictionResult'));
const HistoryPage        = lazy(() => import('./pages/patient/HistoryPage'));
const PatientAppointments = lazy(() => import('./pages/patient/PatientAppointments'));
const ProfilePage        = lazy(() => import('./pages/patient/ProfilePage'));

// Doctor Pages
const DoctorDashboard   = lazy(() => import('./pages/doctor/DoctorDashboard'));
const PatientList       = lazy(() => import('./pages/doctor/PatientList'));
const PatientDetail     = lazy(() => import('./pages/doctor/PatientDetail'));
const DoctorAppointments = lazy(() => import('./pages/doctor/DoctorAppointments'));

// Admin Pages
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));
const DoctorManagement = lazy(() => import('./pages/admin/DoctorManagement'));

// ─── LOADING FALLBACK ─────────────────────────────────────────────────────────
// Shows the gradient background while a page chunk is being fetched.
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-saffron border-t-transparent animate-spin" />
      <p className="text-xs font-black uppercase tracking-widest text-saffron-deep">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Patient Routes */}
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

            {/* Doctor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
              <Route path="/doctor/dashboard" element={<AppLayout><DoctorDashboard /></AppLayout>} />
              <Route path="/doctor/patients" element={<AppLayout><PatientList /></AppLayout>} />
              <Route path="/doctor/patients/:id" element={<AppLayout><PatientDetail /></AppLayout>} />
              <Route path="/doctor/appointments" element={<AppLayout><DoctorAppointments /></AppLayout>} />
              <Route path="/doctor/analytics" element={<AppLayout><AdminDashboard /></AppLayout>} />
              <Route path="/doctor/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AppLayout><AdminDashboard /></AppLayout>} />
              <Route path="/admin/doctors" element={<AppLayout><DoctorManagement /></AppLayout>} />
              <Route path="/admin/analytics" element={<AppLayout><AdminDashboard /></AppLayout>} />
              <Route path="/admin/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
