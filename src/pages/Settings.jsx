import React from 'react';
import GameLayout from '../components/layout/GameLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Settings.css';

const Settings = ({
  onNavigate,
  progress = 0,
  settings,
  onUpdateSettings,
  onResetCase
}) => {
  const currentSettings = settings || {
    soundEnabled: false,
    reducedMotion: false,
    textSize: 'normal',
    showHints: true
  };

  const handleToggle = (key) => {
    if (onUpdateSettings) {
      onUpdateSettings({
        ...currentSettings,
        [key]: !currentSettings[key]
      });
    }
  };

  const handleTextSize = (size) => {
    if (onUpdateSettings) {
      onUpdateSettings({
        ...currentSettings,
        textSize: size
      });
    }
  };

  const handleResetData = () => {
    if (window.confirm("WARNING: This will reset all current case progress, discovered clues, and interrogation notes. Are you sure?")) {
      if (onResetCase) {
        onResetCase();
      }
      alert("Investigation progress has been reset.");
      onNavigate('dashboard');
    }
  };

  return (
    <GameLayout activeItem="settings" onNavigate={onNavigate} progress={progress}>
      <div className="settings-page">
        {/* Page Header */}
        <header className="page-header">
          <div className="header-titles">
            <h1 className="page-title">SYSTEM SETTINGS</h1>
            <h2 className="page-subtitle">TERMINAL PREFERENCES & INVESTIGATION CONTROLS</h2>
          </div>
          <div className="header-meta">
            <p className="page-tagline">"Calibrate your detective terminal interface."</p>
          </div>
        </header>

        <div className="settings-layout">
          <div className="settings-main-col">
            {/* Audio Settings */}
            <Card title="Audio & Acoustics" className="settings-card">
              <div className="settings-row">
                <div className="setting-info">
                  <strong className="setting-label">Atmospheric Audio & Sound Effects</strong>
                  <p className="setting-desc">
                    Toggles synthetic terminal sound cues and typewriter clicks. (Synthesized via Web Audio API when enabled).
                  </p>
                </div>
                <button
                  className={`toggle-switch ${currentSettings.soundEnabled ? 'active' : ''}`}
                  onClick={() => handleToggle('soundEnabled')}
                >
                  <span className="toggle-thumb"></span>
                  <span className="toggle-label">{currentSettings.soundEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </Card>

            {/* Visual & Accessibility Settings */}
            <Card title="Visuals & Accessibility" className="settings-card">
              <div className="settings-row">
                <div className="setting-info">
                  <strong className="setting-label">Reduced Motion (Minimize Animations)</strong>
                  <p className="setting-desc">
                    Disables scanner sweeps, pulse animations, and radar sweeps for reduced GPU utilization.
                  </p>
                </div>
                <button
                  className={`toggle-switch ${currentSettings.reducedMotion ? 'active' : ''}`}
                  onClick={() => handleToggle('reducedMotion')}
                >
                  <span className="toggle-thumb"></span>
                  <span className="toggle-label">{currentSettings.reducedMotion ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              <div className="settings-row">
                <div className="setting-info">
                  <strong className="setting-label">Interface Text Size</strong>
                  <p className="setting-desc">
                    Adjust body text scaling for comfortable reading on higher resolution monitors.
                  </p>
                </div>
                <div className="segmented-control">
                  <button
                    className={`segment-btn ${currentSettings.textSize === 'normal' ? 'active' : ''}`}
                    onClick={() => handleTextSize('normal')}
                  >
                    Normal (100%)
                  </button>
                  <button
                    className={`segment-btn ${currentSettings.textSize === 'large' ? 'active' : ''}`}
                    onClick={() => handleTextSize('large')}
                  >
                    Large (115%)
                  </button>
                </div>
              </div>

              <div className="settings-row">
                <div className="setting-info">
                  <strong className="setting-label">Investigation Clue Highlights</strong>
                  <p className="setting-desc">
                    Display visual indicators on sectors with unexamined clues.
                  </p>
                </div>
                <button
                  className={`toggle-switch ${currentSettings.showHints ? 'active' : ''}`}
                  onClick={() => handleToggle('showHints')}
                >
                  <span className="toggle-thumb"></span>
                  <span className="toggle-label">{currentSettings.showHints ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </Card>

            {/* Storage & Data */}
            <Card title="Session & Data Management" className="settings-card">
              <div className="settings-row">
                <div className="setting-info">
                  <strong className="setting-label">Browser LocalStorage Sync</strong>
                  <p className="setting-desc">
                    Current game state is automatically persisted in your browser's local storage session.
                  </p>
                </div>
                <span className="storage-status-tag">ACTIVE SYNC</span>
              </div>

              <div className="settings-row danger-row">
                <div className="setting-info">
                  <strong className="setting-label text-danger">Reset Case Investigation</strong>
                  <p className="setting-desc">
                    Clear all collected evidence, unlocked questions, and board connections for Case #001.
                  </p>
                </div>
                <Button variant="danger" onClick={handleResetData}>
                  RESET PROGRESS
                </Button>
              </div>
            </Card>

            {/* Navigation back */}
            <div className="settings-actions">
              <Button onClick={() => onNavigate('dashboard')}>
                RETURN TO DASHBOARD
              </Button>
              <Button variant="default" onClick={() => onNavigate('home')}>
                RETURN TO TITLE SCREEN
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default Settings;

