import React from 'react';
import GameLayout from '../components/layout/GameLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { caseData } from '../data/caseData';
import './CaseFile.css';

const CaseFile = ({ onNavigate, progress = 0 }) => {
  return (
    <GameLayout activeItem="case-file" onNavigate={onNavigate} progress={progress}>
      <div className="case-file-page">
        {/* Page Header */}
        <header className="page-header">
          <div className="header-titles">
            <div className="case-classified-tag">
              <span className="stamp-red">OFFICIAL CASE DOSSIER</span>
              <span className="case-number-chip">CASE #{caseData.id}</span>
            </div>
            <h1 className="page-title">{caseData.title}</h1>
            <h2 className="page-subtitle">CLASSIFICATION: CONFIDENTIAL CRIMINAL INVESTIGATION</h2>
          </div>
          <div className="header-meta">
            <p className="page-tagline">"{caseData.tagline}"</p>
            <div className="status-badge-live">
              <span className="live-dot"></span>
              {caseData.status}
            </div>
          </div>
        </header>

        {/* Main Dossier Grid */}
        <div className="case-file-grid">
          {/* Left Column: Briefing & Core Parameters */}
          <div className="case-file-left">
            <Card title="Incident Briefing" className="dossier-card briefing-card">
              <div className="briefing-content">
                <p className="briefing-lead">
                  {caseData.briefing}
                </p>
                <div className="briefing-meta-grid">
                  <div className="meta-box">
                    <span className="meta-box-label">INCIDENT LOCATION</span>
                    <span className="meta-box-val">{caseData.location}</span>
                  </div>
                  <div className="meta-box">
                    <span className="meta-box-label">REPORTED TIME</span>
                    <span className="meta-box-val">{caseData.incidentTime || "11:45 PM"}</span>
                  </div>
                  <div className="meta-box">
                    <span className="meta-box-label">MISSING PROPERTY</span>
                    <span className="meta-box-val highlight-amber">{caseData.missingItem}</span>
                  </div>
                  <div className="meta-box">
                    <span className="meta-box-label">ESTIMATED VALUATION</span>
                    <span className="meta-box-val">{caseData.estimatedValue || "$1,250,000"}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Established Known Facts" className="dossier-card facts-card">
              <ul className="facts-list">
                {caseData.knownFacts.map((fact, idx) => (
                  <li key={idx} className="fact-item">
                    <span className="fact-index">0{idx + 1}</span>
                    <span className="fact-text">{fact}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Right Column: Protocols, Objectives & Launch Action */}
          <div className="case-file-right">
            <Card title="Initial Objective" variant="highlight" className="dossier-card objective-card">
              <div className="objective-icon-bar">
                <span className="obj-badge">PRIMARY DIRECTIVE</span>
              </div>
              <p className="objective-statement">
                "{caseData.initialObjective}"
              </p>
              <div className="objective-action-wrap">
                <Button onClick={() => onNavigate('locations')}>
                  BEGIN LOCATION SEARCH →
                </Button>
                <Button variant="default" onClick={() => onNavigate('dashboard')}>
                  RETURN TO DASHBOARD
                </Button>
              </div>
            </Card>

            <Card title="Important Detective Instructions" className="dossier-card instructions-card">
              <div className="instruction-steps">
                {caseData.instructions.map((instr, idx) => (
                  <div key={idx} className="instruction-row">
                    <div className="step-circle">{idx + 1}</div>
                    <div className="step-content">
                      <span className="step-label">PHASE {idx + 1}</span>
                      <p className="step-desc">{instr}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="quick-access-box">
              <span className="quick-access-title">INVESTIGATION ACCESS:</span>
              <div className="quick-btn-grid">
                <button className="quick-link-btn" onClick={() => onNavigate('evidence')}>
                  <span>📂</span> Review Evidence
                </button>
                <button className="quick-link-btn" onClick={() => onNavigate('suspects')}>
                  <span>👥</span> Inspect Suspects
                </button>
                <button className="quick-link-btn" onClick={() => onNavigate('interrogation')}>
                  <span>🎙️</span> Interrogation Room
                </button>
                <button className="quick-link-btn" onClick={() => onNavigate('investigation-board')}>
                  <span>📌</span> Pin Board
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default CaseFile;

