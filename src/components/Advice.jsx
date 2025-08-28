import React, { useState } from 'react';

const Advice = () => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    setAdvice('');
    // Simulate a 2-second API call to an AI backend
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAdvice(
      'Based on your income level and deductions, you could maximize your tax savings by contributing an additional $2,500 to a traditional IRA before the tax deadline. This could lower your taxable income and result in a larger refund.'
    );
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1>Get AI Tax Advice</h1>
      <div className="card">
        <p>Click the button below to have our AI analyze your financial situation and provide personalized tax-saving advice.</p>
        <button className="button" onClick={handleGetAdvice} disabled={loading}>
          {loading ? 'Analyzing...' : 'Generate Advice'}
        </button>
        {loading && <div className="loader"></div>}
        {advice && (
          <div className="advice-result">
            <h4>Your Personalized Advice:</h4>
            <p>{advice}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Advice;
