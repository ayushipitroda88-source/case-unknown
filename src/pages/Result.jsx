import React from 'react';
import GameLayout from '../components/layout/GameLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { caseData } from '../data/caseData';
import './Result.css';

const Result = ({
  onNavigate,
  progress = 0,
  deductionResult,
  evidenceList = caseData.evidenceList,
  suspectsList = caseData.suspectsList,
  completedQuestions = [],
  connections = [],
  onResetCase
}) => {
  // If player navigated to result without submitting deduction
  const deduction = deductionResult || {
    suspectId: 'S-03',
    evidenceId: 'E-03',
    method: 'M-01',
    timestamp: 'N/A'
  };

  const accusedSuspect = suspectsList.find(s => s.id === deduction.suspectId) || suspectsList[0];
  const citedEvidence = evidenceList.find(e => e.id === deduction.evidenceId) || evidenceList[0];

  const isCulpritCorrect = deduction.suspectId === caseData.solution.culpritId;
  const isEvidenceOptimal = deduction.evidenceId === caseData.solution.keyEvidenceId || deduction.evidenceId === caseData.solution.secondaryEvidenceId;
  const isMethodOptimal = deduction.method === 'M-01';

  // Determine outcome status
  let outcomeType = 'incorrect';
  let outcomeTitle = 'INCORRECT ACCUSATION — WRONGFUL CHARGES';
  let outcomeBadge = 'CASE UNSOLVED';

  if (isCulpritCorrect && isEvidenceOptimal && isMethodOptimal) {
    outcomeType = 'master';
    outcomeTitle = 'CASE SOLVED — MASTER DETECTIVE RESOLUTION';
    outcomeBadge = 'PERFECT DEDUCTION';
  } else if (isCulpritCorrect) {
    outcomeType = 'partial';
    outcomeTitle = 'CASE RESOLVED — CIRCUMSTANTIAL CONVICTION';
    outcomeBadge = 'CULPRIT APPREHENDED';
  }

  // Calculate investigation score
  const discoveredCount = evidenceList.filter(e => e.discovered !== false).length;
  const analyzedCount = evidenceList.filter(e => e.status === 'Analyzed').length;
  const questionedCount = suspectsList.filter(s =>
    (s.questions || []).some(q => completedQuestions.includes(q.id)) || s.status === 'Questioned'
  ).length;

  let score = 0;
  score += Math.round((discoveredCount / evidenceList.length) * 25);
  score += Math.round((analyzedCount / evidenceList.length) * 25);
  score += Math.round((questionedCount / suspectsList.length) * 20);
  score += Math.min(connections.length * 5, 10);
  if (isCulpritCorrect) score += 20;

  let detectiveRank = 'Apprentice Inquirer';
  if (score >= 90) detectiveRank = 'Master Consulting Detective';
  else if (score >= 75) detectiveRank = 'Senior Criminal Investigator';
  else if (score >= 55) detectiveRank = 'Field Inquirer';

  const handleReplay = () => {
    if (window.confirm("Are you sure you want to replay the case? All discovered evidence and interrogation logs will be reset to initial state.")) {
      if (onResetCase) {
        onResetCase();
      }
      onNavigate('case-file');
    }
  };

  return (
    <GameLayout activeItem="deduction" onNavigate={onNavigate} progress={progress}>
      <div className="result-page">
        {/* Banner with Outcome */}
        <div className={`result-hero-banner banner-${outcomeType}`}>
          <div className="hero-status-strip">
            <span className="outcome-stamp">{outcomeBadge}</span>
            <span className="case-ref">CASE #{caseData.id} • OFFICIAL VERDICT</span>
          </div>
          <h1 className="hero-verdict-title">{outcomeTitle}</h1>
          <p className="hero-verdict-sub">
            {outcomeType === 'master' && "Every thread aligned flawlessly. The evidence against Daniel Reed is indisputable."}
            {outcomeType === 'partial' && "You identified the guilty party, though some supporting forensic links require further bolstering."}
            {outcomeType === 'incorrect' && `Your accusation against ${accusedSuspect.name} failed under legal scrutiny. The true culprit escaped.`}
          </p>
        </div>

        {/* Score & Investigation Summary */}
        <div className="result-score-grid">
          <Card className="score-summary-card">
            <div className="score-badge-box">
              <span className="score-number">{score}</span>
              <span className="score-max">/ 100</span>
            </div>
            <div className="score-rank-box">
              <span className="rank-label">DETECTIVE MERIT RANK</span>
              <h3 className="rank-title">{detectiveRank}</h3>
              <p className="rank-desc">
                Calculated across clues found ({discoveredCount}/4), lab analyses ({analyzedCount}/4), suspect depositions ({questionedCount}/3), and deductive accuracy.
              </p>
            </div>
          </Card>
        </div>

        {/* Breakdown Columns */}
        <div className="result-details-grid">
          {/* Left Column: Player's Deductions */}
          <div className="details-col">
            <Card title="Your Submitted Deduction" className="result-card">
              <div className="deduction-recap-row">
                <span className="recap-label">Accused Individual:</span>
                <span className={`recap-value ${isCulpritCorrect ? 'text-correct' : 'text-incorrect'}`}>
                  {accusedSuspect.name} ({accusedSuspect.role}) {isCulpritCorrect ? '✓ [Correct]' : '✗ [Innocent]'}
                </span>
              </div>

              <div className="deduction-recap-row">
                <span className="recap-label">Primary Evidence Cited:</span>
                <span className={`recap-value ${isEvidenceOptimal ? 'text-correct' : 'text-neutral'}`}>
                  {citedEvidence.name} ({citedEvidence.location})
                </span>
              </div>

              <div className="deduction-recap-row">
                <span className="recap-label">Modus Operandi Selected:</span>
                <span className="recap-value">
                  {deduction.method === 'M-01' ? 'Security Console Override & Staged Burglary' :
                   deduction.method === 'M-02' ? 'Balcony Terrace Infiltration' : 'Guest Suite Key Theft'}
                </span>
              </div>

              <div className="recap-outcome-explanation">
                <h4 className="explanation-title">Case Evaluation:</h4>
                {outcomeType === 'master' && (
                  <p className="explanation-text">
                    Brilliant work. By correlating the 17-minute digital security blackout with Daniel Reed's false claims of a municipal power surge and Ethan Blackwood's testimony regarding the breaker confrontation, you dismantled Daniel's alibi entirely. Forensic tests confirmed the broken watch was struck against masonry at 11:18 PM during an altercation with Daniel, proving Reed lied about his whereabouts. Daniel Reed has broken down under interrogation and confessed to concealing the necklace in his locker.
                  </p>
                )}
                {outcomeType === 'partial' && (
                  <p className="explanation-text">
                    You correctly named Daniel Reed as the mastermind behind the theft. While your core accusation is correct, deeper examination of the Security Log ({caseData.solution.keyEvidenceId}) was necessary to establish the airtight forensic proof that no municipal surge occurred. Nonetheless, Daniel has been remanded into custody!
                  </p>
                )}
                {outcomeType === 'incorrect' && (
                  <p className="explanation-text">
                    {accusedSuspect.id === 'S-01' && (
                      "Ethan Blackwood's financial distress and broken watch made him an appealing suspect, but forensics proved the watch was smashed at 11:10 PM in an altercation when he caught Daniel Reed tampering with the breakers. The silver key belongs only to an antique archive desk. Ethan is cleared of the theft."
                    )}
                    {accusedSuspect.id === 'S-02' && (
                      "Clara Morgan's torn fabric on the balcony was circumstantial. Clara provided verified mobile phone records showing she was on a continuous business call during the entire 17-minute blackout. The balcony was merely a diversionary route Daniel Reed left unlatched to mislead investigators."
                    )}
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: The Canonical Case Solution */}
          <div className="details-col">
            <Card title="Official Criminal Reconstruction" className="result-card canonical-card">
              <div className="canon-perpetrator-box">
                <span className="canon-label">TRUE PERPETRATOR:</span>
                <h3 className="canon-culprit">{caseData.solution.culpritName} ({caseData.solution.culpritId})</h3>
                <span className="canon-role">Security Officer on Duty</span>
              </div>

              <div className="canon-summary-section">
                <h4 className="canon-section-heading">How the Crime Was Committed:</h4>
                <p className="canon-text">{caseData.solution.summary}</p>
              </div>

              <div className="canon-summary-section">
                <h4 className="canon-section-heading">Motive:</h4>
                <p className="canon-text">{caseData.solution.motive}</p>
              </div>

              <div className="canon-evidence-points">
                <h4 className="canon-section-heading">Decisive Incriminating Evidence:</h4>
                <ul className="canon-bullets">
                  <li>
                    <strong>Security Log (E-03):</strong> Digital audit confirms the blackout was a manual command from the Security Terminal, not a municipal surge.
                  </li>
                  <li>
                    <strong>Broken Watch (E-01):</strong> Uniform nylon fibers and balustrade paint place Daniel Reed in a violent altercation with Ethan prior to the blackout.
                  </li>
                  <li>
                    <strong>Clara Morgan's Eyewitness Account:</strong> Saw Daniel inside the breaker room manipulating switches with tools just before the outage.
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Post-Verdict Actions */}
        <div className="result-actions-bar">
          <Button onClick={handleReplay} variant="primary" className="btn-action-large">
            🔄 REPLAY CASE #001
          </Button>
          <Button onClick={() => onNavigate('dashboard')} variant="default" className="btn-action-large">
            RETURN TO DASHBOARD
          </Button>
          <Button onClick={() => onNavigate('notes')} variant="default" className="btn-action-large">
            VIEW DETECTIVE JOURNAL
          </Button>
        </div>
      </div>
    </GameLayout>
  );
};

export default Result;

