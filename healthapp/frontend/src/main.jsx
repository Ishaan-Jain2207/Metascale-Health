import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

/**
 * METASCALE BARE ROOT - VER 3
 * Logic: Absolute minimal mounting to resolve 'ReferenceError: t is not defined'.
 * This version uses named imports and explicit hydration logs.
 */

console.log('CLINICAL OS: BARE ROOT V3 STARTING');

try {
  const container = document.getElementById('root');
  
  if (!container) {
    throw new Error('Root element #root not found in DOM.');
  }

  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <div style={{ padding: '60px', background: 'blue', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 20px 0' }}>
          METASCALE <span style={{ color: '#ffd3a1' }}>ROOT V3</span>
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Timestamp: {new Date().toLocaleTimeString()}
        </p>
        <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
          <p><strong>Status:</strong> Evaluation Successful</p>
          <p>If you see this BLUE box, the ReferenceError is <strong>RESOVLED</strong>.</p>
        </div>
      </div>
    </React.StrictMode>
  );
  
  console.log('CLINICAL OS: RENDER COMPLETED');
} catch (error) {
  console.error('CLINICAL OS: CRITICAL MOUNT FAILURE', error);
  document.body.innerHTML = `
    <div style="padding: 40px; background: #991b1b; color: white; font-family: sans-serif;">
      <h1>CRITICAL MOUNT FAILURE</h1>
      <pre>${error.message}</pre>
    </div>
  `;
}
