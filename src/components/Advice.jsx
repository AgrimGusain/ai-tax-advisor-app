import React, { useState } from 'react';

const Advice = () => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [selectedStrategies, setSelectedStrategies] = useState([]);

  const strategies = [
    { id: 'retirement', name: 'Retirement Planning', icon: '🏦' },
    { id: 'deductions', name: 'Deduction Optimization', icon: '📊' },
    { id: 'investments', name: 'Investment Strategy', icon: '📈' },
    { id: 'credits', name: 'Tax Credit Analysis', icon: '💳' },
    { id: 'business', name: 'Business Expenses', icon: '💼' },
    { id: 'estate', name: 'Estate Planning', icon: '🏡' }
  ];

  const handleGetAdvice = async () => {
    setLoading(true);
    setAdvice('');
    
    // Simulate AI analysis with different responses based on type
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    let aiResponse = '';
    
    if (analysisType === 'quick') {
      aiResponse = `🎯 **Quick Tax Optimization Analysis**

**Immediate Actions:**
• Contribute $1,500 more to your IRA before the deadline for an additional $330 tax savings
• Consider bunching charitable donations this year to exceed standard deduction threshold
• Review your withholdings - you may be over-paying by approximately $200/month

**Estimated Additional Savings: $1,240**`;
    } else if (analysisType === 'comprehensive') {
      aiResponse = `🧠 **Comprehensive AI Tax Strategy**

**High-Impact Recommendations:**

🏦 **Retirement Optimization**
• Max out your 401(k) contribution ($23,000) - saves $5,520 in taxes
• Consider backdoor Roth conversion for long-term growth
• HSA contributions can save additional $900 annually

📊 **Deduction Strategy**
• Home office deduction potential: $1,800
• Professional development expenses: $650
• State tax optimization through timing strategies

💡 **Advanced Strategies**
• Tax-loss harvesting in your investment portfolio
• Qualified Small Business Stock (QSBS) eligibility review
• Charitable remainder trust evaluation for high-net-worth planning

**Total Projected Savings: $8,970**
**ROI on Professional Tax Planning: 892%**`;
    } else {
      aiResponse = `📈 **Investment Tax Strategy**

**Portfolio Optimization:**
• Rebalance to tax-efficient asset allocation
• Consider municipal bonds for your tax bracket (28%)
• Timing strategies for capital gains realization

**Cryptocurrency Considerations:**
• Harvest losses from crypto positions
• FIFO vs LIFO accounting method optimization

**Estimated Tax Impact: $3,450 savings**`;
    }
    
    setAdvice(aiResponse);
    setLoading(false);
  };

  const toggleStrategy = (strategyId) => {
    setSelectedStrategies(prev => 
      prev.includes(strategyId) 
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  return (
    <div className="page-container">
      <h1>🧠 AI Tax Advisor</h1>
      
      <div className="card">
        <h2>Personalized Tax Strategy</h2>
        <p>
          Our advanced AI analyzes your complete financial picture to identify optimization 
          opportunities and provide actionable recommendations tailored to your specific situation.
        </p>

        {/* Analysis Type Selection */}
        <div style={{ margin: '2rem 0' }}>
          <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>Analysis Type</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { id: 'quick', name: 'Quick Scan', desc: '5-min analysis', icon: '⚡' },
              { id: 'comprehensive', name: 'Deep Dive', desc: 'Complete review', icon: '🔍' },
              { id: 'investment', name: 'Investment Focus', desc: 'Portfolio optimization', icon: '📈' }
            ].map(type => (
              <div
                key={type.id}
                onClick={() => setAnalysisType(type.id)}
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: `2px solid ${analysisType === type.id ? '#7c7fc8' : 'rgba(255,255,255,0.2)'}`,
                  background: analysisType === type.id ? 'rgba(124, 127, 200, 0.2)' : 'rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{type.icon}</div>
                <div style={{ fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem' }}>
                  {type.name}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                  {type.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Focus Areas */}
        <div style={{ margin: '2rem 0' }}>
          <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>Focus Areas (Optional)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {strategies.map(strategy => (
              <div
                key={strategy.id}
                onClick={() => toggleStrategy(strategy.id)}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: `1px solid ${selectedStrategies.includes(strategy.id) ? '#ff77c6' : 'rgba(255,255,255,0.2)'}`,
                  background: selectedStrategies.includes(strategy.id) ? 'rgba(255, 119, 198, 0.2)' : 'rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{strategy.icon}</div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '600', 
                  color: selectedStrategies.includes(strategy.id) ? '#ff77c6' : 'rgba(255,255,255,0.8)'
                }}>
                  {strategy.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="button" onClick={handleGetAdvice} disabled={loading}>
          {loading ? (
            <>
              <span style={{ marginRight: '0.5rem' }}>🤖</span>
              AI Analyzing Your Finances...
            </>
          ) : (
            <>
              <span style={{ marginRight: '0.5rem' }}>🚀</span>
              Generate AI Recommendations
            </>
          )}
        </button>
        
        {loading && (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <div className="loader"></div>
            <div style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>
              <div>🔍 Analyzing your financial data...</div>
              <div style={{ marginTop: '0.5rem' }}>⚙️ Running optimization algorithms...</div>
              <div style={{ marginTop: '0.5rem' }}>💡 Generating personalized strategies...</div>
            </div>
          </div>
        )}
        
        {advice && (
          <div className="advice-result">
            <h4>🎯 Your Personalized AI Recommendations</h4>
            <div style={{ whiteSpace: 'pre-line', fontSize: '1.05rem' }}>
              {advice}
            </div>
            
            <div style={{ 
              marginTop: '2rem', 
              padding: '1.5rem',
              background: 'rgba(120, 219, 255, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(120, 219, 255, 0.3)'
            }}>
              <h4 style={{ color: '#78dbff', marginBottom: '1rem' }}>📅 Next Steps</h4>
              <div style={{ color: 'rgba(255,255,255,0.9)' }}>
                <div>1. Review and prioritize recommendations</div>
                <div>2. Implement highest-impact strategies first</div>
                <div>3. Schedule quarterly check-ins for optimization</div>
                <div>4. Consider consulting with a tax professional for complex strategies</div>
              </div>
            </div>

            <div style={{ 
              marginTop: '1rem', 
              display: 'flex', 
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
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
        )}
      </div>

      {/* AI Confidence & Methodology */}
      <div className="card">
        <h2>🤖 AI Analysis Methodology</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h4 style={{ color: '#7c7fc8', marginBottom: '0.5rem' }}>Data Analysis</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              Machine learning algorithms analyze 1000+ tax code scenarios
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
            <h4 style={{ color: '#ff77c6', marginBottom: '0.5rem' }}>Real-time Updates</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              Continuously updated with latest tax law changes
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
            <h4 style={{ color: '#78dbff', marginBottom: '0.5rem' }}>Precision Targeting</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              Recommendations tailored to your specific financial profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advice;