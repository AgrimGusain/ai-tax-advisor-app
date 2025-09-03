import React from 'react';

const Dashboard = ({ user }) => {
  // Helper function to get the display name from user object
  const getDisplayName = (user) => {
    // Try to get the preferred username from attributes first
    if (user?.attributes?.preferred_username) {
      return user.attributes.preferred_username;
    }
    // Try other username-related attributes
    if (user?.attributes?.['custom:username']) {
      return user.attributes['custom:username'];
    }
    if (user?.attributes?.given_name) {
      return user.attributes.given_name;
    }
    if (user?.attributes?.name) {
      return user.attributes.name;
    }
    // If no username attributes are available, extract from loginId (email)
    if (user?.signInDetails?.loginId) {
      return user.signInDetails.loginId.split('@')[0];
    }
    // Fallback
    return 'User';
  };

  const displayName = getDisplayName(user);

  return (
    <div className="page-container">
      <h1>Welcome Back, {displayName}! 🚀</h1>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">$2,450</div>
          <div className="stat-label">Potential Savings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">3</div>
          <div className="stat-label">Documents Uploaded</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">94%</div>
          <div className="stat-label">Tax Optimization</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">12</div>
          <div className="stat-label">AI Recommendations</div>
        </div>
      </div>

      <div className="card">
        <h2>🎯 Your Tax Command Center</h2>
        <p>
          Welcome to your personalized AI-powered tax optimization dashboard. Our advanced algorithms 
          analyze your financial data in real-time to maximize your savings and ensure compliance.
        </p>
        <p>
          Ready to unlock your tax potential? Navigate through our powerful features using the 
          navigation above to upload documents, get AI-powered advice, or manage your profile.
        </p>
        
        <div style={{ 
          marginTop: '2rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{
            padding: '1rem',
            background: 'rgba(124, 127, 200, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(124, 127, 200, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📤</div>
            <div style={{ fontWeight: '600', color: '#7c7fc8' }}>Upload Documents</div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
              Secure document processing
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 119, 198, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 119, 198, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🧠</div>
            <div style={{ fontWeight: '600', color: '#ff77c6' }}>AI Analysis</div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
              Smart tax optimization
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            background: 'rgba(120, 219, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(120, 219, 255, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ fontWeight: '600', color: '#78dbff' }}>Real-time Insights</div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
              Instant recommendations
            </div>
          </div>
        </div>
      </div>

      {/* Debug section - Remove this after testing
      {process.env.NODE_ENV === 'development' && (
        <div className="card" style={{ 
          background: 'rgba(255, 107, 107, 0.1)', 
          border: '1px solid rgba(255, 107, 107, 0.3)' 
        }}>
          <h2>🔧 Debug Info (Development Only)</h2>
          <details>
            <summary style={{ cursor: 'pointer', marginBottom: '1rem' }}>
              Click to see user object structure
            </summary>
            <pre style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '1rem', 
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.8rem',
              color: '#ffffff'
            }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>
      )} */}
    </div>
  );
};

export default Dashboard;