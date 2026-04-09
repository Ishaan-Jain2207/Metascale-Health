/**
 * METASCALE HEALTH: GLOBAL IDENTITY VECTOR (AuthContext.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This file defines the 'Identity Anchor' for the Clinical OS frontend. 
 * it is the central conduit through which authentication state (tokens, 
 * user profile, role) is propagated across the entire React component tree.
 * 
 * ─── CONTEXT DECOUPLING PATTERN ─────────────────────────────────────────────
 * We intentionally isolate the 'createContext' invocation into its own file.
 * Logic:
 *   1. CIRCULAR DEPENDENCY PREVENTION: By separating the 'Definition' (Context) 
 *      from the 'Mechanism' (Provider), we allow downstream hooks (useAuth) 
 *      to import the context without triggering recursive import cycles.
 *   2. HMR OPTIMIZATION: Keeps Hot Module Replacement stable by ensuring 
 *      the context reference remains persistent even if the Provider 
 *      logic re-renders.
 */

import { createContext } from 'react';

/**
 * AUTHENTICATION CONTEXT
 * The primary consumer-token used by the 'useAuth' hook to access normalized 
 * identity state.
 */
export const AuthContext = createContext();


