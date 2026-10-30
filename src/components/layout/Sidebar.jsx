import React from 'react';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Command Hub', icon: '⚡' },
  { id: 'case-file', label: 'Case File', icon: '📂' },
  { id: 'evidence', label: 'Evidence Lab', icon: '🔬' },
  { id: 'suspects', label: 'Suspects', icon: '👥' },
  { id: 'locations', label: 'Locations', icon: '📍' },
  { id: 'timeline', label: 'Timeline', icon: '🕒' },
  { id: 'interrogation', label: 'Interrogation', icon: '🎙️' },
  { id: 'investigation-board', label: 'Pin Board', icon: '📌' },
  { id: 'deduction', label: 'Deduction', icon: '⚖️' },
  { id: 'notes', label: 'Case Notes', icon: '📝' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
];

const Sidebar = ({ 
  caseId = '001', 
  activeItem, 
  onNavigate,
  isOpen = false,
  onCloseMobile
}) => {
  const handleNavClick = (screenId) => {
    if (onNavigate) {
      onNavigate(screenId);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="sidebar-mobile-backdrop" onClick={onCloseMobile}></div>
      )}

      <aside className={`investigation-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-strip">
            <h2 className="sidebar-case-id">CASE #{caseId}</h2>
            {onCloseMobile && (
              <button className="sidebar-close-mobile-btn" onClick={onCloseMobile}>✕</button>
            )}
          </div>
          <div className="sidebar-case-title">THE MISSING NECKLACE</div>
          <div className="sidebar-divider"></div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const isActive = activeItem === item.id || 
              (item.id === 'dashboard' && (activeItem === 'overview' || !activeItem)) ||
              (item.id === 'investigation-board' && activeItem === 'board');

            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-marker"></span>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label-text">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-dot"></span>
            <span>SYSTEM ONLINE • SECURE</span>
          </div>
          <button 
            className="home-return-btn" 
            onClick={() => handleNavClick('home')}
            title="Return to Game Title Screen"
          >
            ← Exit to Title
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
