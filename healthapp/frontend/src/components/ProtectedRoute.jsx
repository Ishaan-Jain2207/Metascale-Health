/**
 * PROTECTED ROUTE (Security Gateway)
 * Purpose: Enforces authentication and Role-Based Access Control (RBAC) at the routing level.
 * Logic: 
 *   - Monitors the 'Loading' state to prevent flashing 'Unauthenticated' views during hydration.
 *   - Redirects anonymous users to the Login gateway.
 *   - Validates user 'Role' against the 'allowedRoles' array to prevent privilege escalation.
 */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  // 1. HYDRATION GUARD: Provide a clinical spinner while the session is synchronizing.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // 2. AUTHENTICATION GUARD: Redirect to login if no identity vector is present.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. AUTHORIZATION GATE: Redirect to landing if the user role is not permitted for this route.
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // SUCCESS: Render the child routes within the protected boundary.
  return <Outlet />;
};

export default ProtectedRoute;

