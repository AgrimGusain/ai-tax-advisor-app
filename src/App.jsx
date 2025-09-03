import React, { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';

// Import the new components we will create
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import Advice from './components/Advice';
import Profile from './components/Profile';

// Import styles
import './App.css';

function App() {
  // This state will control which page is currently visible
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = (user) => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'upload':
        return <Upload />;
      case 'advice':
        return <Advice />;
      case 'profile':
        return <Profile user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };
  
  // Define the fields for the sign-up form
  const formFields = {
    signUp: {
      username: {
        placeholder: 'Enter your desired username',
        order: 1,
      },
      email: {
        placeholder: 'Enter your email address',
        order: 2,
      },
      password: {
        placeholder: 'Enter your password',
        order: 3,
      },
      confirm_password: {
        placeholder: 'Confirm your password',
        order: 4,
      },
    },
  };

  return (
    <Authenticator formFields={formFields}>
      {({ signOut, user }) => (
        <div className="app-layout">
          <Navbar 
            user={user} 
            signOut={signOut} 
            setCurrentPage={setCurrentPage} 
          />
          <main className="app-content">
            {renderPage(user)}
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;