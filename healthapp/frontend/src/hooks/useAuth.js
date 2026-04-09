/**
 * USE AUTH (Identity Consumer Hook)
 * Purpose: Provides a streamlined interface for components to access the global identity context.
 * Logic: 
 *   - Hooks into the 'AuthContext' to retrieve session state and management methods.
 *   - Enforces the 'Provider Boundary' rule: throws a clinical error if consumed out-of-context.
 *   - Optimizes property access for RBAC checks in the UI layer.
 */
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // BOUNDARY GUARD: Ensures the hook is only invoked within the 'AuthProvider' tree.
  if (!context) {
    throw new Error('[IDENTITY FAULT] useAuth called outside of the Authentication Provider scope.');
  }

  return context;
};

