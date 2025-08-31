import React, { useState, useEffect } from 'react';

const Advice = () => {
  // State to hold the list of advice items
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amplifyConfigured, setAmplifyConfigured] = useState(false);

  useEffect(() => {
    // Check if Amplify is configured and try to load data
    const loadAdviceData = async () => {
      try {
        // Try to check if Amplify is configured
        const { Amplify } = await import('aws-amplify');
        const config = Amplify.getConfig();
        
        if (config && config.API && config.API.GraphQL) {
          // Amplify is configured, try to load real data
          setAmplifyConfigured(true);
          const { generateClient } = await import('aws-amplify/data');
          const client = generateClient();
          
          const { data: advice } = await client.models.Advice.list();
          const sortedAdvice = advice.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setAdviceList(sortedAdvice);
        } else {
          // Amplify not configured, show message
          setAmplifyConfigured(false);
          setError('Backend not deployed. Please run "npx ampx sandbox" first.');
        }
      } catch (err) {
        console.error('Error loading advice:', err);
        setAmplifyConfigured(false);
        setError('Backend not configured. Please deploy your Amplify backend first.');
      } finally {
        setLoading(false);
      }
    };

    loadAdviceData();
  }, []);

  return (
    <div className="page-container">
      <h1>🧠 AI-Generated Tax Advice</h1>
      
      {/* Backend Not Configured Error */}
      {!amplifyConfigured && error && (
        <div className="card" style={{ 
          border: '1px solid #ff6b6b', 
          background: 'rgba(255, 107, 107, 0.1)' 
        }}>
          <h2 style={{ color: '#ff6b6b' }}>⚠️ Backend Not Configured</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)' }}>
            Your AWS Amplify backend hasn't been deployed yet.
          </p>
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <h4 style={{ color: '#78dbff', marginBottom: '0.5rem' }}>To fix this:</h4>
            <ol style={{ color: 'rgba(255,255,255,0.8)', paddingLeft: '1.5rem' }}>
              <li>Open your terminal in the project directory</li>
              <li>Run: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>npx ampx sandbox</code></li>
              <li>Wait for deployment to complete</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      )}

      {/* Standard Error State */}
      {amplifyConfigured && error && (
        <div className="card" style={{ 
          border: '1px solid #ff6b6b', 
          background: 'rgba(255, 107, 107, 0.1)' 
        }}>
          <h2 style={{ color: '#ff6b6b' }}>⚠️ Error</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)' }}>{error}</p>
          <button 
            className="button" 
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem' }}
          >
            🔄 Refresh Page
          </button>
        </div>
      )}
      
      {/* Loading State */}
      {loading && !error && (
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="loader"></div>
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>
            Fetching your personalized advice...
          </p>
        </div>
      )}

      {/* No Advice Yet State */}
      {!loading && !error && adviceList.length === 0 && amplifyConfigured && (
        <div className="card">
          <h2>No Advice Found</h2>
          <p>
            You don't have any tax advice yet. Go to the "Upload" page to upload a tax document. 
            Our AI will analyze it and generate personalized recommendations for you here.
          </p>
        </div>
      )}

      {/* Display Advice List */}
      {!loading && !error && adviceList.length > 0 && (
        adviceList.map((adviceItem) => (
          <div key={adviceItem.id} className="card">
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
                  onClick={() => {
                    console.log('Generate report for:', adviceItem.id);
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
                  onClick={() => {
                    console.log('Email summary for:', adviceItem.id);
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