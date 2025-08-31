// src/main.jsx (or wherever your app entry point is)
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import App from './App.jsx'
import './index.css'

// Try to import the outputs file, fall back if it doesn't exist
let outputs = {};
try {
  outputs = await import('../amplify_outputs.json');
} catch (error) {
  console.warn('Amplify outputs not found. Make sure to run "npx ampx sandbox" first.');
}

// Configure Amplify if outputs are available
if (outputs.default) {
  Amplify.configure(outputs.default);
  console.log('Amplify configured successfully');
} else {
  console.warn('Amplify not configured - backend not deployed yet');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)