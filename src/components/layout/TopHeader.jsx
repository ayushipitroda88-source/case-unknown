import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import './TopHeader.css';

const TopHeader = ({ progress = 0, onNavigate, onToggleMobileMenu }) => {
  return (
    <header className="top-header">
      <div className="header-left">
        {onToggleMobileMenu && (
          <button 
            className="mobile-menu-toggle-btn"
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        )}
        <div 
          className="header-brand" 
          onClick={() => onNavigate && onNavigate('home')} 
          style={{ cursor: onNavigate ? 'pointer' : 'default' }}
          title="Return to Home Screen"
        >
          <span className="brand-title">CASE: UNKNOWN</span>
        </div>
      </div>
      
      <div className="header-progress">
        <ProgressBar 
          value={progress} 
          max={100} 
          label="Investigation Progress" 
          showValue={true} 
        />
      </div>
      
      <div className="header-right">
        <button 
          className="header-settings-btn"
          onClick={() => onNavigate && onNavigate('settings')}
          title="System Settings"
        >
          ⚙️
        </button>

        <div className="header-profile">
          <div className="profile-info">
            <span className="profile-role">LEAD DETECTIVE</span>
            <span className="profile-id">BADGE #8492</span>
          </div>
          <div className="profile-avatar">
            <span className="avatar-letter">D</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
