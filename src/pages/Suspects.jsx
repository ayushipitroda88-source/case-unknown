import React, { useState } from 'react';
import GameLayout from '../components/layout/GameLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { caseData } from '../data/caseData';
import './Suspects.css';

const Suspects = ({ 
  onNavigate,
  progress = 0,
  suspectsList = caseData.suspectsList,
  evidenceList = caseData.evidenceList,
  completedQuestions = [],
  onSelectSuspect
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState(
    suspectsList.length > 0 ? suspectsList[0].id : null
  );

  const selectedSuspect = suspectsList.find(s => s.id === selectedSuspectId) || suspectsList[0];

  const questionedCount = suspectsList.filter(s =>
    (s.questions || []).some(q => completedQuestions.includes(q.id)) || s.status === 'Questioned'
  ).length;

  const handleSelect = (id) => {
    setSelectedSuspectId(id);
    if (onSelectSuspect) {
      onSelectSuspect(id);
    }
  };

  const handleGoToInterrogation = () => {
    if (onSelectSuspect && selectedSuspect) {
      onSelectSuspect(selectedSuspect.id);
    }
    onNavigate('interrogation');
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Find related evidence items from shared evidenceList
  const getRelatedEvidence = (suspect) => {
    if (!suspect.relatedEvidenceIds) return [];
    return evidenceList.filter(e => suspect.relatedEvidenceIds.includes(e.id));
  };

  const isQuestioned = (suspect) => {
    return (suspect.questions || []).some(q => completedQuestions.includes(q.id)) || suspect.status === 'Questioned';
  };

  const answeredQuestionsCount = (suspect) => {
    return (suspect.questions || []).filter(q => completedQuestions.includes(q.id)).length;
  };

  return (
    <GameLayout activeItem="suspects" onNavigate={onNavigate} progress={progress}>
      <div className="suspects-page">
        {/* Page Header */}
        <header className="page-header">
          <div className="header-titles">
            <h1 className="page-title">SUSPECT DOSSIERS</h1>
            <h2 className="page-subtitle">CASE #{caseData.id} — PERSONS OF INTEREST UNDER INQUIRY</h2>
          </div>
          <div className="header-meta">
            <p className="page-tagline">"Everyone has a secret. One of them is a crime."</p>
            <div className="evidence-count-badge">
              <span className="count-number">0{questionedCount} / 0{suspectsList.length}</span> Interrogated
            </div>
          </div>
        </header>

        {/* Disclaimer strip */}
        <div className="suspect-disclaimer-strip">
          <span className="strip-icon">⚖️</span>
          <span>
            LEGAL MANDATE: All subjects remain under investigative scrutiny. Presumption of innocence applies until conclusive forensic deduction is submitted.
          </span>
        </div>

        {/* Content Area */}
        <div className="suspects-content-area">
          {/* Suspects Grid */}
          <div className="suspects-grid">
            {suspectsList.map(suspect => {
              const questioned = isQuestioned(suspect);
              const answered = answeredQuestionsCount(suspect);

              return (
                <div
                  key={suspect.id}
                  className={`suspect-card ${selectedSuspectId === suspect.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(suspect.id)}
                >
                  <div className="suspect-card-header">
                    <span className="suspect-id">{suspect.id}</span>
                    <span
                      className={`suspect-status-tag ${
                        questioned ? 'status-questioned' : 'status-unquestioned'
                      }`}
                    >
                      {questioned ? `Questioned (${answered}/3)` : 'Not Questioned'}
                    </span>
                  </div>

                  <div className="suspect-avatar-placeholder">
                    <div className="avatar-silhouette">
                      {getInitials(suspect.name)}
                    </div>
                    <div className="visual-scanline"></div>
                  </div>

                  <div className="suspect-card-body">
                    <h4 className="suspect-card-name">{suspect.name}</h4>
                    <span className="suspect-card-role">{suspect.role}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dossier Detail Panel */}
          <div className="suspect-detail-panel">
            {selectedSuspect ? (
              <Card title="Classified Suspect Dossier" className="suspect-detail-card">
                <div className="suspect-detail-header">
                  <span className="detail-id">{selectedSuspect.id}</span>
                  <span
                    className={`suspect-status-tag ${
                      isQuestioned(selectedSuspect) ? 'status-questioned' : 'status-unquestioned'
                    }`}
                  >
                    {isQuestioned(selectedSuspect) ? 'DEPOSITION ON RECORD' : 'UNQUESTIONED'}
                  </span>
                </div>

                <h3 className="suspect-detail-name">{selectedSuspect.name}</h3>
                <p className="suspect-detail-role">{selectedSuspect.role}</p>

                <div className="suspect-profile-visual">
                  <div className="profile-initials">
                    {getInitials(selectedSuspect.name)}
                  </div>
                  <span className="profile-classified">OFFICIAL POLICE FILE • PERSON OF INTEREST</span>
                </div>

                <div className="suspect-dossier-grid">
                  <div className="dossier-field">
                    <span className="dossier-label">Profile Description</span>
                    <span className="dossier-value">{selectedSuspect.description}</span>
                  </div>

                  <div className="dossier-field">
                    <span className="dossier-label">Last Known Location</span>
                    <span className="dossier-value">{selectedSuspect.lastSeen}</span>
                  </div>

                  <div className="dossier-field">
                    <span className="dossier-label">Stated Alibi</span>
                    <span className="dossier-value">{selectedSuspect.alibi}</span>
                  </div>

                  <div className="dossier-field">
                    <span className="dossier-label">Investigative Motive Hypothesis</span>
                    <span className="dossier-value">{selectedSuspect.motive}</span>
                  </div>

                  <div className="dossier-field full-width">
                    <span className="dossier-label">Detective's Known Information</span>
                    <span className="dossier-value highlight-notes">{selectedSuspect.notes}</span>
                  </div>
                </div>

                {/* Related Evidence Badges */}
                <div className="related-evidence-section">
                  <span className="dossier-label">Cross-Referenced Evidence:</span>
                  <div className="related-chips-grid">
                    {getRelatedEvidence(selectedSuspect).map(ev => (
                      <div
                        key={ev.id}
                        className={`related-chip ${ev.discovered ? 'discovered' : 'undiscovered'}`}
                        onClick={() => onNavigate('evidence')}
                      >
                        <span className="chip-icon">{ev.discovered ? '✓' : '⚠'}</span>
                        <span className="chip-name">{ev.name} ({ev.id})</span>
                        <span className="chip-status">{ev.discovered ? ev.status : 'Undiscovered'}</span>
                      </div>
                    ))}
                    {getRelatedEvidence(selectedSuspect).length === 0 && (
                      <span className="no-related-evidence">No physical evidence directly tagged yet.</span>
                    )}
                  </div>
                </div>

                {/* Interrogation Actions */}
                <div className="suspect-actions">
                  <Button
                    onClick={handleGoToInterrogation}
                    variant={isQuestioned(selectedSuspect) ? 'default' : 'primary'}
                  >
                    {isQuestioned(selectedSuspect) ? 'CONTINUE INTERROGATION →' : '🎙️ QUESTION SUSPECT NOW'}
                  </Button>
                  <Button variant="default" onClick={() => onNavigate('investigation-board')}>
                    VIEW ON PIN BOARD
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="empty-selection">
                <p>Select a suspect to inspect their file.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default Suspects;
