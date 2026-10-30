import React, { useState } from 'react';
import Button from '../components/ui/Button';
import './Home.css';

const Home = ({ onNavigate, hasSavedProgress = false, onStartFresh }) => {
  const [showExitModal, setShowExitModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleStartFreshConfirm = () => {
    setShowResetModal(false);
    if (onStartFresh) {
      onStartFresh();
    } else {
      onNavigate('case-file');
    }
  };

  return (
    <div className="home-container">
      {/* Background visual elements */}
      <div className="home-vignette"></div>
      <div className="home-particles"></div>
      <div className="home-light-beam"></div>
      
      <div className="home-content">
        <div className="title-section">
          <div className="case-badge-pill">CRIMINAL INVESTIGATION DIVISION • CASE #001</div>
          <h1 className="game-title">
            <span className="title-case">CASE:</span>
            <span className="title-unknown">UNKNOWN</span>
          </h1>
          
          <div className="tagline-container">
            <p className="tagline">"Every clue tells a story.</p>
            <p className="tagline indent">Every story hides a truth."</p>
          </div>
        </div>

        <div className="menu-section">
          {hasSavedProgress ? (
            <>
              <Button 
                onClick={() => onNavigate('dashboard')} 
                className="home-btn-primary"
              >
                Continue Investigation
              </Button>
              <Button 
                onClick={() => setShowResetModal(true)} 
                variant="default"
                className="home-btn"
              >
                New Investigation
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => onNavigate('case-file')} 
              className="home-btn-primary"
            >
              Start Investigation
            </Button>
          )}

          <Button 
            onClick={() => onNavigate('case-file')} 
            variant="default"
            className="home-btn"
          >
            Case Files
          </Button>
          <Button 
            onClick={() => onNavigate('settings')} 
            variant="default"
            className="home-btn"
          >
            Settings
          </Button>
          <Button 
            onClick={() => setShowExitModal(true)} 
            variant="danger"
            className="home-btn"
          >
            Exit Terminal
          </Button>
        </div>
        
        <div className="version-info">
          <span>CASE: UNKNOWN v1.0 • React + Vite</span>
        </div>
      </div>

      {/* Start Fresh Confirmation Modal */}
      {showResetModal && (
        <div className="exit-modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="exit-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="exit-modal-header">
              <span className="modal-stamp">NEW INQUIRY CONFIRMATION</span>
              <h3 className="modal-title">Commence Fresh Investigation?</h3>
            </div>
            <p className="modal-message">
              Starting a new case will reset all recovered evidence, suspect interrogation depositions, and custom notes for Case #001.
            </p>
            <div className="modal-info-box">
              <span>This action will clear your current local session progress.</span>
            </div>
            <div className="modal-actions">
              <Button variant="default" onClick={() => setShowResetModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleStartFreshConfirm}>
                Start New Case
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="exit-modal-overlay" onClick={() => setShowExitModal(false)}>
          <div className="exit-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="exit-modal-header">
              <span className="modal-stamp">LOGOFF ADVISORY</span>
              <h3 className="modal-title">Suspend Investigation Session?</h3>
            </div>
            <p className="modal-message">
              Detective active status will be saved to your browser session. You may resume Case #001 at any time.
            </p>
            <div className="modal-info-box">
              <span>Investigation state is automatically synchronized to local storage.</span>
            </div>
            <div className="modal-actions">
              <Button onClick={() => setShowExitModal(false)}>
                Stay On Duty
              </Button>
              <Button 
                variant="danger" 
                onClick={() => {
                  setShowExitModal(false);
                  alert("Investigation suspended. You may safely close this browser tab.");
                }}
              >
                Close Terminal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
