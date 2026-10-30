import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ value, max = 100, label, showValue = true }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="progress-container">
      {label && (
        <div className="progress-header">
          <span className="progress-label">{label}</span>
          {showValue && <span className="progress-value">{value} / {max}</span>}
        </div>
      )}
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        >
          <div className="progress-glow"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
