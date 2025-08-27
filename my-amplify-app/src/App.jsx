// src/App.jsx

import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main style={styles.container}>
          <div style={styles.loggedInContainer}>
            <h1>Hello, {user.username}!</h1>
            <p>Your email is: {user.attributes.email}</p>
            <button style={styles.button} onClick={signOut}>
              Sign Out
            </button>
          </div>
        </main>
      )}
    </Authenticator>
  );
}

// Basic styling for the authenticated view
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: `sans-serif`,
  },
  loggedInContainer: {
    padding: '40px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    backgroundColor: 'white',
    textAlign: 'center',
    width: '400px',
  },
  button: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#64748b',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '20px',
  },
};

export default App;