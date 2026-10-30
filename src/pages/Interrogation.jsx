import React, { useState } from 'react';
import GameLayout from '../components/layout/GameLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { caseData } from '../data/caseData';
import './Interrogation.css';

const Interrogation = ({
  onNavigate,
  progress = 0,
  suspectsList = caseData.suspectsList,
  completedQuestions = [],
  onAskQuestion,
  selectedSuspectIdProp = null
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState(
    selectedSuspectIdProp || (suspectsList.length > 0 ? suspectsList[0].id : null)
  );
  const [activeDialogue, setActiveDialogue] = useState(null);
  const [unlockedLeadToast, setUnlockedLeadToast] = useState(null);

  const selectedSuspect = suspectsList.find(s => s.id === selectedSuspectId) || suspectsList[0];

  const handleSelectSuspect = (id) => {
    setSelectedSuspectId(id);
    setActiveDialogue(null);
  };

  const handleAsk = (questionObj) => {
    const isAlreadyAsked = completedQuestions.includes(questionObj.id);

    setActiveDialogue({
      question: questionObj.question,
      answer: questionObj.answer,
      unlockLead: questionObj.unlockLead,
      isNewDiscovery: !isAlreadyAsked
    });

    if (!isAlreadyAsked && onAskQuestion) {
      onAskQuestion(selectedSuspect.id, questionObj);
      setUnlockedLeadToast(questionObj.unlockLead);
      setTimeout(() => setUnlockedLeadToast(null), 4000);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const totalQuestionsAsked = completedQuestions.length;

  return (
    <GameLayout activeItem="interrogation" onNavigate={onNavigate} progress={progress}>
      <div className="interrogation-page">
        {/* Page Header */}
        <header className="page-header">
          <div className="header-titles">
            <h1 className="page-title">INTERROGATION ROOM</h1>
            <h2 className="page-subtitle">CASE #{caseData.id} — SUSPECT TESTIMONY & INQUIRY</h2>
          </div>
          <div className="header-meta">
            <p className="page-tagline">"Inconsistencies emerge when truth is strained."</p>
            <div className="interrogation-stat-badge">
              <span className="count-number">0{totalQuestionsAsked}</span> Questions Recorded
            </div>
          </div>
        </header>

        {/* Lead Toast */}
        {unlockedLeadToast && (
          <div className="interrogation-toast">
            <span className="toast-glow-icon">💡</span>
            <div className="toast-lead-text">
              <strong>NEW INVESTIGATION LEAD UNLOCKED:</strong>
              <p>{unlockedLeadToast}</p>
            </div>
          </div>
        )}

        <div className="interrogation-layout">
          {/* Left Column: Suspect Selector Roster */}
          <div className="suspect-selector-col">
            <div className="selector-title-bar">
              <span>PERSONS OF INTEREST</span>
              <span className="selector-count">{suspectsList.length}</span>
            </div>

            <div className="suspect-pills-list">
              {suspectsList.map(suspect => {
                const isSelected = suspect.id === selectedSuspect?.id;
                const answeredForThisSuspect = (suspect.questions || []).filter(q =>
                  completedQuestions.includes(q.id)
                ).length;
                const totalForThisSuspect = suspect.questions?.length || 3;

                return (
                  <div
                    key={suspect.id}
                    className={`suspect-interrogate-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectSuspect(suspect.id)}
                  >
                    <div className="suspect-card-avatar">
                      {getInitials(suspect.name)}
                    </div>
                    <div className="suspect-card-meta">
                      <div className="suspect-meta-top">
                        <span className="suspect-card-name">{suspect.name}</span>
                        <span className="suspect-role-chip">{suspect.role}</span>
                      </div>
                      <div className="suspect-questions-meter">
                        <span className="meter-label">
                          Questions: {answeredForThisSuspect} / {totalForThisSuspect}
                        </span>
                        <span className={`status-indicator ${answeredForThisSuspect > 0 ? 'active' : 'pending'}`}>
                          {answeredForThisSuspect === totalForThisSuspect ? 'Fully Examined' : answeredForThisSuspect > 0 ? 'In Progress' : 'Unquestioned'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Dossier Box for Selected Suspect */}
            {selectedSuspect && (
              <Card title="Subject File Brief" className="selected-dossier-card">
                <div className="dossier-mini-row">
                  <span className="mini-label">Stated Alibi:</span>
                  <span className="mini-val">{selectedSuspect.alibi}</span>
                </div>
                <div className="dossier-mini-row">
                  <span className="mini-label">Motive:</span>
                  <span className="mini-val">{selectedSuspect.motive}</span>
                </div>
                <div className="dossier-mini-row">
                  <span className="mini-label">Last Sighted:</span>
                  <span className="mini-val">{selectedSuspect.lastSeen}</span>
                </div>
                <button
                  className="view-full-dossier-btn"
                  onClick={() => onNavigate('suspects')}
                >
                  View Full Suspect Dossier →
                </button>
              </Card>
            )}
          </div>

          {/* Right Column: Interrogation Center & Dialogue Box */}
          <div className="interrogation-dialogue-col">
            {selectedSuspect ? (
              <div className="interrogation-active-view">
                {/* Suspect Header Banner */}
                <div className="interrogate-banner">
                  <div className="interrogate-portrait">
                    <span className="portrait-letters">{getInitials(selectedSuspect.name)}</span>
                    <span className="status-live-tag">DEPOSITION UNDER CAUTION</span>
                  </div>
                  <div className="interrogate-info">
                    <div className="interrogate-name-row">
                      <h2 className="interrogate-name">{selectedSuspect.name}</h2>
                      <span className="interrogate-id">{selectedSuspect.id}</span>
                    </div>
                    <p className="interrogate-desc">{selectedSuspect.description}</p>
                  </div>
                </div>

                {/* Spoken Dialogue Feed / Transcript */}
                <Card title="Interrogation Transcript" className="transcript-box">
                  {activeDialogue ? (
                    <div className="dialogue-exchange">
                      <div className="exchange-bubble detective-bubble">
                        <div className="bubble-speaker">
                          <span className="speaker-tag">LEAD DETECTIVE</span>
                        </div>
                        <p className="bubble-text">"{activeDialogue.question}"</p>
                      </div>

                      <div className="exchange-bubble suspect-bubble">
                        <div className="bubble-speaker">
                          <span className="speaker-tag suspect-tag">{selectedSuspect.name.toUpperCase()}</span>
                        </div>
                        <p className="bubble-text">"{activeDialogue.answer}"</p>
                      </div>

                      {activeDialogue.unlockLead && (
                        <div className="exchange-lead-box">
                          <span className="lead-tag">CRITICAL DISCOVERY</span>
                          <p className="lead-text">{activeDialogue.unlockLead}</p>
                          <span className="lead-note-sync">✓ Recorded in Case Notes</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="dialogue-placeholder">
                      <div className="placeholder-icon">🎙️</div>
                      <p className="placeholder-primary">The tape recorder is running.</p>
                      <p className="placeholder-sub">
                        Select a line of questioning below to interrogate {selectedSuspect.name}.
                      </p>
                    </div>
                  )}
                </Card>

                {/* Available Questions List */}
                <div className="questions-section">
                  <h3 className="questions-header">Lines of Questioning</h3>
                  <div className="questions-grid">
                    {(selectedSuspect.questions || []).map((q, idx) => {
                      const isAsked = completedQuestions.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          className={`question-item ${isAsked ? 'question-asked' : 'question-available'}`}
                        >
                          <div className="question-item-top">
                            <span className="q-number">LINE #{idx + 1}</span>
                            <span className={`q-status-badge ${isAsked ? 'badge-asked' : 'badge-new'}`}>
                              {isAsked ? '✓ ON RECORD' : 'AVAILABLE'}
                            </span>
                          </div>
                          <p className="q-prompt">"{q.question}"</p>
                          <button
                            className="btn-ask-question"
                            onClick={() => handleAsk(q)}
                          >
                            {isAsked ? 'Replay Response' : 'Ask Question'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-selection">
                <p>Select a suspect from the left to commence questioning.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default Interrogation;

