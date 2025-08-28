import React from 'react';

const Navbar = ({ user, signOut, setCurrentPage }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h3>💰 AI Tax Advisor</h3>
      </div>
      <div className="navbar-links">
        <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
        <button onClick={() => setCurrentPage('upload')}>Upload</button>
        <button onClick={() => setCurrentPage('advice')}>Advice</button>
        <button onClick={() => setCurrentPage('profile')}>Profile</button>
      </div>
      <div className="navbar-user">
        <span>{user?.attributes?.email}</span>
        <button className="signout-button" onClick={signOut}>Sign Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
