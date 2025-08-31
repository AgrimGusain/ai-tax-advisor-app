import React, { useState } from 'react';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    income: '',
    filingStatus: 'single',
    dependents: '0',
    state: '',
    preferences: ''
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="page-container">
      <h1>👤 Your Profile</h1>
      
      <div className="card">
        <h2>Personal Information</h2>
        <p style={{ marginBottom: '2rem' }}>
          Keep your information up to date to receive the most accurate tax advice and recommendations.
        </p>

        <div className="profile-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Annual Income */}
          <div className="form-group">
            <label htmlFor="income">Annual Income</label>
            <input
              type="number"
              id="income"
              name="income"
              value={profile.income}
              onChange={handleChange}
              placeholder="Enter your annual income"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="filingStatus">Filing Status</label>
              <select
                id="filingStatus"
                name="filingStatus"
                value={profile.filingStatus}
                onChange={handleChange}
              >
                <option value="single">Single</option>
                <option value="married-joint">Married Filing Jointly</option>
                <option value="married-separate">Married Filing Separately</option>
                <option value="head-of-household">Head of Household</option>
                <option value="widow">Qualifying Widow(er)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="dependents">Number of Dependents</label>
              <select
                id="dependents"
                name="dependents"
                value={profile.dependents}
                onChange={handleChange}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4 or more</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="state">State of Residence</label>
            <input
              type="text"
              id="state"
              name="state"
              value={profile.state}
              onChange={handleChange}
              placeholder="e.g., California, Texas, New York"
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferences">Tax Preferences & Notes</label>
            <textarea
              id="preferences"
              name="preferences"
              value={profile.preferences}
              onChange={handleChange}
              placeholder="Any specific tax preferences, goals, or notes for our AI to consider..."
              rows="4"
            />
          </div>

          <button 
            className="button" 
            onClick={handleSave}
            disabled={saving}
            style={{ width: '100%' }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          
          {saving && <div className="loader"></div>}
        </div>
      </div>

      {/* Account Settings Card */}
      <div className="card">
        <h2>Account Settings</h2>
        <div style={{ 
          display: 'grid', 
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
        }}>
          <div style={{
            padding: '1.5rem',
            background: 'rgba(124, 127, 200, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(124, 127, 200, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📧</div>
            <h4 style={{ color: '#7c7fc8', marginBottom: '0.5rem' }}>Email</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              {user?.attributes?.email}
            </p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            background: 'rgba(255, 119, 198, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 119, 198, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔐</div>
            <h4 style={{ color: '#ff77c6', marginBottom: '0.5rem' }}>Security</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              2FA Enabled
            </p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            background: 'rgba(120, 219, 255, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(120, 219, 255, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💎</div>
            <h4 style={{ color: '#78dbff', marginBottom: '0.5rem' }}>Plan</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              Premium Member
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Data Card */}
      <div className="card">
        <h2>🛡️ Privacy & Data</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Your data privacy is our top priority. Here's how we protect your information:
        </p>
        
        <div style={{ 
          display: 'grid', 
          gap: '1rem',
          color: 'rgba(255,255,255,0.8)',
          lineHeight: '1.6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#7c7fc8' }}>🔒</span>
            <span>All personal data is encrypted using AES-256 encryption</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#ff77c6' }}>🗑️</span>
            <span>Tax documents are automatically deleted after 7 days</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#78dbff' }}>🚫</span>
            <span>We never share your data with third parties</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#7c7fc8' }}>📊</span>
            <span>Only anonymized data is used for AI model improvements</span>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '1.5rem', 
          display: 'flex', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button 
            style={{
              background: 'rgba(255, 107, 107, 0.2)',
              border: '1px solid rgba(255, 107, 107, 0.5)',
              color: '#ff6b6b',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 107, 107, 0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 107, 107, 0.2)'}
          >
            Delete All Data
          </button>
          <button 
            style={{
              background: 'rgba(124, 127, 200, 0.2)',
              border: '1px solid rgba(124, 127, 200, 0.5)',
              color: '#7c7fc8',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(124, 127, 200, 0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(124, 127, 200, 0.2)'}
          >
            Download My Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;