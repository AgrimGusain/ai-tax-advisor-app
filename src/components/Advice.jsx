import React, { useState, useEffect } from 'react';

const Advice = () => {
  // State to hold the list of advice items
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for now - replace this with actual database connection later
    const timer = setTimeout(() => {
      setLoading(false);
      // You can add some mock data here for testing
      // setAdviceList([{ id: 1, adviceText: "Sample advice", createdAt: new Date() }]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-container">
      <h1>🧠 AI-Generated Tax Advice</h1>
      
      {/* Loading State */}
      {loading && (
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="loader"></div>
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>
            Fetching your personalized advice...
          </p>
        </div>
      )}

      {/* No Advice Yet State */}
      {!loading && adviceList.length === 0 && (
        <div className="card">
          <h2>No Advice Found</h2>
          <p>
            You don't have any tax advice yet. Go to the "Upload" page to upload a tax document. 
            Our AI will analyze it and generate personalized recommendations for you here.
          </p>
        </div>
      )}

      {/* Display Advice List */}
      {!loading && adviceList.length > 0 && (
        adviceList.map((adviceItem, index) => (
          <div key={adviceItem.id || index} className="card">
            <div className="advice-result">
              <h4>🎯 Recommendations from analysis on {new Date(adviceItem.createdAt).toLocaleString()}</h4>
              <div style={{ whiteSpace: 'pre-line', fontSize: '1.05rem', marginTop: '1rem' }}>
                {adviceItem.adviceText}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  className="button" 
                  style={{ 
                    background: 'linear-gradient(135deg, #78dbff 0%, #7c7fc8 100%)',
                    flex: '1',
                    minWidth: '200px'
                  }}
                >
                  📊 Generate Report
                </button>
                <button 
                  className="button" 
                  style={{ 
                    background: 'linear-gradient(135deg, #ff77c6 0%, #7c7fc8 100%)',
                    flex: '1',
                    minWidth: '200px'
                  }}
                >
                  📧 Email Summary
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Methodology Card */}
      <div className="card">
        <h2>🤖 AI Analysis Methodology</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h4 style={{ color: '#7c7fc8', marginBottom: '0.5rem' }}>Data Analysis</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              Machine learning algorithms analyze 1000+ tax code scenarios.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
            <h4 style={{ color: '#ff77c6', marginBottom: '0.5rem' }}>Real-time Updates</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              Continuously updated with latest tax law changes.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
            <h4 style={{ color: '#78dbff', marginBottom: '0.5rem' }}>Precision Targeting</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              Recommendations tailored to your specific financial profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advice;