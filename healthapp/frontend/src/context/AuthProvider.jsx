/**
 * METASCALE HEALTH: IDENTITY STATE MACHINE (AuthProvider.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component is the 'Engine Room' for identity management. It implements 
 * a centralized state machine that orchestrates authentication lifecycle 
 * across the entire application.
 * 
 * ─── THE HYDRATION HANDSHAKE (checkUser) ────────────────────────────────────
 * Upon initial mount (Page Refresh), the provider performs a 'Clinical 
 * Handshake' with the backend:
 *   1. PERSISTENCE CHECK: Pulls the 'token' from LocalStorage.
 *   2. SERVER SYNC: Probes /auth/me to verify the token signature and 
 *      retrieve the fresh user object (including role/status).
 *   3. HYDRATION: Blocks application rendering (via the 'loading' state) 
 *      until the identity is confirmed, preventing 'layout thrashing' and 
 *      unauthorized initial flashes.
 * 
 * ─── RBAC PROPAGATION ───────────────────────────────────────────────────────
 * The 'user' object managed here is the single source of truth for Role-Based 
 * Access Control. Changes to this object trigger re-renders in ProtectedRoute 
 * components and Sidebars, naturally pivoting the UI between Patient and 
 * Doctor modalities.
 */

import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  // ATOMIC STATES: 'user' holds the clinical profile; 'loading' prevents premature rendering.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * IDENTITY SYNCHRONIZATION: The Clinical Handshake
   * Logic: 
   *   - Verifies the integrity of the JWT against the server.
   *   - Purges LocalStorage if the server rejects the token (expunging ghost sessions).
   */
  const checkUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/auth/me');
        // Success: Hydrate the global user state with the server-verified profile.
        setUser(res.data.data);
      } catch {
        // Validation Fault: Token is corrupt or expired. Tear down client state.
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    // Completion: Exit the hydration phase.
    setLoading(false);
  }, []);

  // LIFECYCLE: Automatic hydration on boot.
  useEffect(() => {
    checkUser();
  }, [checkUser]);

  /**
   * WORKFLOW: CREDENTIAL EXCHANGE (login)
   * Exchanges raw credentials (email/password) for a signed JWT.
   */
  const login = async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data?.data) {
        // Commitment: Persist token to disk and profile to memory.
        localStorage.setItem('token', res.data.data.token);
        setUser(res.data.data.user);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: 'Identity service returned an ambiguous payload.' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Authentication sequence failed.' 
      };
    }
  };

  /**
   * WORKFLOW: IDENTITY CREATION (register)
   * Orchestrates account initialization and immediate session binding.
   */
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data?.data) {
        localStorage.setItem('token', res.data.data.token);
        setUser(res.data.data.user);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: 'Identity created, but session handshake failed.' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Registration sequence interrupted.' 
      };
    }
  };

  /**
   * WORKFLOW: SESSION TERMINATION (logout)
   * Logic: Finalizes the session by purging all identity materials from the client environment.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // EXPOSURE: The Provider provides the identity interface to the tree.
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};


