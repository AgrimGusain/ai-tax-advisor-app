import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import './App.css'; // You can add component-specific styles here if you wish

function App() {
  return (
    // The Authenticator component wraps your app and handles the entire login flow.
    // It will show a login/signup form if the user is not authenticated.
    <Authenticator>
      {/* This part of the code only renders when a user is successfully signed in. */}
      {/* It automatically receives the `signOut` function and `user` object as props. */}
      {({ signOut, user }) => (
        <main className="app-container">
          <div className="loggedIn-container">
            <h1>Hello, {user.username}!</h1>
            <p>You have successfully signed in.</p>
            {/* ✅ FIX: Use optional chaining to safely access the email attribute */}
            <p className="user-email">Your email is: {user?.attributes?.email}</p>
            <button className="button" onClick={signOut}>
              Sign Out
            </button>
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
