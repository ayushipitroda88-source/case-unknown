import React from 'react';
import './EvidenceCard.css';

const EvidenceCard = ({ evidence, isSelected, onClick }) => {
  const getStatusClass = (status) => {
    switch(status) {
      case 'Analyzed': return 'status-analyzed';
      case 'Needs Analysis': return 'status-needs-analysis';
      case 'Unidentified': return 'status-unidentified';
      case 'Undiscovered': return 'status-undiscovered';
      default: return 'status-needs-analysis';
    }
  };

  const isDiscovered = evidence.discovered !== false;

  return (
    <div 
      className={`evidence-card ${isSelected ? 'selected' : ''} ${!isDiscovered ? 'undiscovered' : ''}`}
      onClick={() => onClick(evidence)}
    >
      <div className="evidence-card-header">
        <span className="evidence-id">{evidence.id}</span>
        <span className={`evidence-status-dot ${getStatusClass(evidence.status)}`}></span>
      </div>
      
      <div className="evidence-visual-placeholder">
        <div className="visual-scanline"></div>
        {!isDiscovered && <span className="visual-text" style={{ fontSize: '0.75rem' }}>UNDISCOVERED</span>}
      </div>
      
      <div className="evidence-card-body">
        <h4 className="evidence-name">
          {evidence.name}
        </h4>
        <div className="evidence-meta">
          <span className="meta-label">Type:</span> {evidence.type}
        </div>
        <div className="evidence-meta">
          <span className="meta-label">Location:</span> {evidence.location}
        </div>
      </div>
    </div>
  );
};

export default EvidenceCard;
