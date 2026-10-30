import React, { useState } from 'react';
import GameLayout from '../components/layout/GameLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { caseData } from '../data/caseData';
import './Deduction.css';

const Deduction = ({
  onNavigate,
  progress = 0,
  evidenceList = caseData.evidenceList,
  suspectsList = caseData.suspectsList,
  timelineList = caseData.timelineList,
  notesList = [],
  completedQuestions = [],
  connections = [],
  onSubmitDeduction
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showIncompleteConfirm, setShowIncompleteConfirm] = useState(false);

  const discoveredEvidence = evidenceList.filter(e => e.discovered !== false);
  const analyzedEvidence = evidenceList.filter(e => e.status === 'Analyzed');
  const questionedSuspects = suspectsList.filter(s =>
    (s.questions || []).some(q => completedQuestions.includes(q.id)) || s.status === 'Questioned'
  );

  const isInvestigationThorough = discoveredEvidence.length >= 3 && questionedSuspects.length >= 2;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSuspectId || !selectedEvidenceId || !selectedMethod) {
      alert("Please select the accused suspect, primary evidence, and the method of the crime.");
      return;
    }

    if (!isInvestigationThorough && !showIncompleteConfirm) {
      setShowIncompleteConfirm(true);
      return;
    }

    const deductionPayload = {
      suspectId: selectedSuspectId,
      evidenceId: selectedEvidenceId,
      method: selectedMethod,
      timestamp: new Date().toLocaleTimeString()
    };

    if (onSubmitDeduction) {
      onSubmitDeduction(deductionPayload);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <GameLayout activeItem="deduction" onNavigate={onNavigate} progress={progress}>
      <div className="deduction-page">
        {/* Page Header */}
        <header className="page-header">
          <div className="header-titles">
            <h1 className="page-title">FINAL DEDUCTION</h1>
            <h2 className="page-subtitle">CASE #{caseData.id} — INDICTMENT & SOLUTION SUBMISSION</h2>
          </div>
          <div className="header-meta">
            <p className="page-tagline">"Reasoning without evidence is blind. Evidence without reasoning is inert."</p>
            <div className="readiness-meter">
              <span className="meter-dot"></span>
              Investigation Readiness: {isInvestigationThorough ? 'OPTIMAL' : 'PRELIMINARY'}
            </div>
          </div>
        </header>

        {/* Investigation Audit Bar */}
        <div className="deduction-audit-bar">
          <div className="audit-item">
            <span className="audit-val">{discoveredEvidence.length} / {evidenceList.length}</span>
            <span className="audit-label">Clues Recovered</span>
          </div>
          <div className="audit-divider"></div>
          <div className="audit-item">
            <span className="audit-val">{analyzedEvidence.length} / {evidenceList.length}</span>
            <span className="audit-label">Clues Analyzed</span>
          </div>
          <div className="audit-divider"></div>
          <div className="audit-item">
            <span className="audit-val">{questionedSuspects.length} / {suspectsList.length}</span>
            <span className="audit-label">Suspects Questioned</span>
          </div>
          <div className="audit-divider"></div>
          <div className="audit-item">
            <span className="audit-val">{connections.length}</span>
            <span className="audit-label">Board Hypotheses</span>
          </div>
          <div className="audit-divider"></div>
          <div className="audit-item">
            <span className="audit-val">{notesList.length}</span>
            <span className="audit-label">Field Notes</span>
          </div>
        </div>

        {/* Warning if early submission */}
        {!isInvestigationThorough && (
          <div className="deduction-caution-box">
            <span className="caution-icon">⚠️</span>
            <div className="caution-text">
              <strong>PREMATURE DEDUCTION NOTICE:</strong> You haven't uncovered all clues or questioned all persons of interest. Deductions based on partial findings risk framing the wrong individual.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="deduction-form">
          <div className="deduction-steps-grid">
            {/* Step 1: Accuse a Suspect */}
            <Card title="Step 1: Identify The Perpetrator" className="deduction-card">
              <p className="step-prompt">Select the individual you believe organized or executed the theft:</p>
              <div className="suspect-choice-grid">
                {suspectsList.map(suspect => {
                  const isSelected = selectedSuspectId === suspect.id;
                  const isQuestioned = (suspect.questions || []).some(q => completedQuestions.includes(q.id));

                  return (
                    <div
                      key={suspect.id}
                      className={`suspect-choice-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedSuspectId(suspect.id)}
                    >
                      <div className="suspect-choice-top">
                        <div className="choice-avatar">{getInitials(suspect.name)}</div>
                        <div className="choice-meta">
                          <h4 className="choice-name">{suspect.name}</h4>
                          <span className="choice-role">{suspect.role}</span>
                        </div>
                      </div>
                      <p className="choice-alibi"><strong>Stated Alibi:</strong> {suspect.alibi}</p>
                      <div className="choice-status-row">
                        <span className={`status-tag ${isQuestioned ? 'tag-done' : 'tag-pending'}`}>
                          {isQuestioned ? '✓ Questioned' : 'Unquestioned'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Step 2: Primary Incriminating Evidence */}
            <Card title="Step 2: Primary Incriminating Evidence" className="deduction-card">
              <p className="step-prompt">Select the physical or digital evidence that directly disproves the suspect's story:</p>
              <div className="evidence-choice-grid">
                {evidenceList.map(item => {
                  const isSelected = selectedEvidenceId === item.id;
                  const isDiscovered = item.discovered !== false;

                  return (
                    <div
                      key={item.id}
                      className={`evidence-choice-card ${isSelected ? 'selected' : ''} ${!isDiscovered ? 'not-discovered' : ''}`}
                      onClick={() => isDiscovered && setSelectedEvidenceId(item.id)}
                    >
                      <div className="choice-ev-header">
                        <span className="ev-id">{item.id}</span>
                        <span className="ev-loc">{item.location}</span>
                      </div>
                      <h4 className="ev-name">{item.name}</h4>
                      <p className="ev-desc">
                        {isDiscovered ? item.description : 'Undiscovered clue. Must be investigated first.'}
                      </p>
                      <div className="ev-status-line">
                        <span className="ev-analysis-chip">{item.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Step 3: Modus Operandi */}
            <Card title="Step 3: Modus Operandi (Method of Crime)" className="deduction-card">
              <p className="step-prompt">Formulate the sequence of actions executed by the perpetrator:</p>
              <div className="methods-list">
                {[
                  {
                    id: 'M-01',
                    label: 'Security Console Override & Staged Burglary',
                    text: 'The culprit exploited security console credentials to deliberately initiate the 17-minute blackout, bypassed the glass display lock, stole the sapphire necklace, and fractured the glass outward to fake an external burglary.'
                  },
                  {
                    id: 'M-02',
                    label: 'Balcony Terrace Infiltration & Garden Escape',
                    text: 'The perpetrator scaled the west balcony during the rain, tore their garments on the trellis, slipped into the living room during the confusion, and fled across the estate grounds.'
                  },
                  {
                    id: 'M-03',
                    label: 'Guest Suite Key Theft & Family Conspiratorial Theft',
                    text: 'The culprit obtained the silver family key from the guest suite desk, entered the showcase while attendees were dining, and pocketed the necklace to clear outstanding debts.'
                  }
                ].map(method => (
                  <label
                    key={method.id}
                    className={`method-radio-card ${selectedMethod === method.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="crimeMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                    />
                    <div className="method-content">
                      <strong className="method-label">{method.label}</strong>
                      <p className="method-text">{method.text}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            {/* Confirmation & Submission */}
            <div className="submission-card-box">
              <div className="summary-banner">
                <div className="summary-title">FINAL CHARGES SUMMARY</div>
                <div className="summary-line">
                  <span>Accused Suspect:</span>
                  <strong>{suspectsList.find(s => s.id === selectedSuspectId)?.name || 'None Selected'}</strong>
                </div>
                <div className="summary-line">
                  <span>Key Evidence:</span>
                  <strong>{evidenceList.find(e => e.id === selectedEvidenceId)?.name || 'None Selected'}</strong>
                </div>
              </div>

              {showIncompleteConfirm && (
                <div className="confirm-modal-inline">
                  <p>Are you sure you want to proceed with incomplete evidence? A false accusation cannot be retracted.</p>
                  <div className="confirm-btn-row">
                    <Button variant="danger" type="submit">
                      CONFIRM & SUBMIT CHARGES
                    </Button>
                    <Button variant="default" onClick={() => setShowIncompleteConfirm(false)}>
                      Resume Investigation
                    </Button>
                  </div>
                </div>
              )}

              {!showIncompleteConfirm && (
                <div className="submit-btn-wrap">
                  <Button
                    type="submit"
                    variant="danger"
                    className="btn-submit-deduction"
                    disabled={!selectedSuspectId || !selectedEvidenceId || !selectedMethod}
                  >
                    SUBMIT FORMAL CHARGES & SOLVE CASE →
                  </Button>
                  <Button variant="default" onClick={() => onNavigate('dashboard')}>
                    Cancel & Return
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </GameLayout>
  );
};

export default Deduction;

