import React from 'react'
import ReactDOM from 'react-dom/client'

console.log('CLINICAL OS: MAIN BUNDLE EVALUATING');

try {
  const root = document.getElementById('root');
  if (!root) {
    console.error('CLINICAL OS: ROOT ELEMENT NOT FOUND');
    document.body.innerHTML = '<h1 style="color:red">ROOT ELEMENT NOT FOUND</h1>';
  } else {
    ReactDOM.createRoot(root).render(
      <div style={{ padding: '50px', background: 'red', color: 'white', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '3rem' }}>METASCALE BARE ROOT TEST</h1>
        <p>Bundle Time: {new Date().toLocaleTimeString()}</p>
        <p>If you see this red box, the Vite build and Main entry point are working.</p>
        <p>This means the crash is INSIDE App.jsx or its imports.</p>
      </div>
    );
    console.log('CLINICAL OS: MOUNT SUCCESSFUL');
  }
} catch (err) {
  console.error('CLINICAL OS: MOUNT FAILURE', err);
  document.body.innerHTML = `<h1 style="color:red">MOUNT FAILURE: ${err.message}</h1>`;
}
