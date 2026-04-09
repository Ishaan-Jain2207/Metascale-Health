/**
 * METASCALE HEALTH: API DATA TRANSPORT LAYER (api.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This service is the 'Nervous System' of the frontend. It provides a 
 * centralized, pre-configured Axios client that handles all network 
 * communication between the React application and the Clinical OS backend.
 * 
 * ─── HOST DISCOVERY ENGINE ──────────────────────────────────────────────────
 * We implement a dynamic 'BaseURL' resolution strategy:
 *   1. VITE OVERRIDE: Prioritizes explicit environmental variables.
 *   2. NETWORK DETECTION: Automatically detects if the application is 
 *      running on a mobile device or a local subnet and adjusts the 
 *      API endpoint accordingly. This is critical for cross-platform debugging.
 * 
 * ─── IDENTITY INTERCEPTION PATTERN ──────────────────────────────────────────
 * The transport layer implements 'Zero-Maintenance Authentication':
 *   - REQUEST INTERCEPTOR: Every outgoing request is intercepted to 
 *     automatically inject the most recent 'Bearer Token' from LocalStorage. 
 *     This ensures individual components never have to manually manage headers.
 *   - RESPONSE INTERCEPTOR: Every incoming error is intercepted to provide 
 *     standardized clinical logging and telemetry, ensuring that network 
 *     faults are captured with full forensic detail.
 */

import axios from 'axios';

/**
 * INTERNAL: DYNAMIC ENDPOINT RESOLUTION
 * Logic: Ensures parity between development environments (Local vs Mobile vs Subnet).
 */
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  const { hostname } = window.location;
  // If not on a local loopback, assume network-based API discovery.
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:5000/api`;
  }
  
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 20000, // 20s Latency Buffer for heavy diagnostic synthesis.
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * STAGE 1: IDENTITY INJECTION (Outbound)
 * Logic: Synchronously hydrates the Authorization header with the clinical JWT.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * STAGE 2: TRANSPORT NORMALIZATION (Inbound)
 * Logic: Standardizes error reporting for clinical observability.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Audit Commit: Log the failure context to the console.
    console.error('[TRANSPORT FAULT] Interaction Failed:', {
      endpoint: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

export default api;


