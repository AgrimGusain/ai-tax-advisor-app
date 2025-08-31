import React from 'react';

const Dashboard = ({ user }) => {
  return (
    <div className="page-container">
      <h1>Welcome Back, {user.username}! 🚀</h1>
      
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
    </div>
  );
};

export default Dashboard;

