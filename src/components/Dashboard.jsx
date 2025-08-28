import React from 'react';

const Dashboard = ({ user }) => {
  return (
    <div className="page-container">
      <h1>Welcome, {user.username}!</h1>
      <div className="card">
        <h2>Dashboard Overview</h2>
        <p>This is your main dashboard. From here, you can navigate to upload documents, get personalized tax advice, or view your profile.</p>
        <p>Select an option from the navigation bar above to get started.</p>
      </div>
    </div>
  );
};

export default Dashboard;
    