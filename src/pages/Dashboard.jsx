import React from 'react';
import GameLayout from '../components/layout/GameLayout';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { caseData } from '../data/caseData';
import './Dashboard.css';

const Dashboard = ({ 
  onNavigate, 
  progress = 0,
  evidenceList = caseData.evidenceList,
  suspectsList = caseData.suspectsList,
  investigatedLocations = [],
  completedQuestions = [],
  connections = [],
  notesList = []
}) => {
  // Derived state calculations
  const totalClues = evidenceList.length;
  const discoveredClues = evidenceList.filter(e => e.discovered !== false);
  const discoveredCount = discoveredClues.length;
  const inspectedCount = evidenceList.filter(e => e.inspected === true).length;
  const analyzedCount = evidenceList.filter(e => e.status === 'Analyzed').length;

  const totalSuspects = suspectsList.length;
  const questionedSuspectsCount = suspectsList.filter(s =>
    (s.questions || []).some(q => completedQuestions.includes(q.id)) || s.status === 'Questioned'
  ).length;

  const totalLocations = caseData.locationsList.length;
  const investigatedLocationsCount = Math.max(
    investigatedLocations.length,
    caseData.locationsList.filter(loc => {
      const clue = evidenceList.find(e => e.id === loc.clueId);
      return clue && clue.discovered !== false;
    }).length
  );

  // Dynamic Objective based on actual state
  let dynamicObjective = "Investigate estate sectors (Living Room, Balcony, Security Room, Guest Room) to locate physical evidence.";
  let objectiveActionLabel = "Inspect Locations";
  let objectiveActionTarget = "locations";

  if (discoveredCount === 0) {
    dynamicObjective = "Begin your inquiry by searching the 4 active sectors in the Locations sector.";
    objectiveActionLabel = "Search Locations";
    objectiveActionTarget = "locations";
  } else if (analyzedCount < discoveredCount) {
    dynamicObjective = `You have collected ${discoveredCount} clue(s). Examine and analyze them in the Evidence Lab to uncover forensic leads.`;
    objectiveActionLabel = "Examine Evidence";
    objectiveActionTarget = "evidence";
  } else if (questionedSuspectsCount < totalSuspects) {
    dynamicObjective = "Cross-examine the remaining suspects in the Interrogation Room to test their alibis.";
    objectiveActionLabel = "Interrogate Suspects";
    objectiveActionTarget = "interrogation";
  } else if (connections.length === 0) {
    dynamicObjective = "Map suspect alibis and physical evidence together on the Investigation Board.";
    objectiveActionLabel = "Open Pin Board";
    objectiveActionTarget = "investigation-board";
  } else {
    dynamicObjective = "Sufficient evidence assembled. Synthesize all findings and submit formal charges in Deduction.";
    objectiveActionLabel = "Solve Case";
    objectiveActionTarget = "deduction";
  }

  // Latest discovery item
  const latestDiscovery = discoveredClues.length > 0
    ? discoveredClues[discoveredClues.length - 1]
    : null;

  return (
    <GameLayout activeItem="dashboard" onNavigate={onNavigate} progress={progress}>
      <div className="dashboard-container">
        <div className="content-left">
          {/* Case Overview Banner */}
          <section className="overview-section">
            <div className="case-id-badge">ACTIVE DOSSIER • CASE #{caseData.id}</div>
            <h1 className="case-title">{caseData.title}</h1>
            <div className="case-meta">
              <span className="meta-item">STATUS: <span className="highlight-status">{caseData.status}</span></span>
              <span className="meta-item">LOCATION: {caseData.location}</span>
              <span className="meta-item">INCIDENT TIME: {caseData.incidentTime || "11:45 PM"}</span>
            </div>
            <p className="case-summary">{caseData.summary || caseData.briefing}</p>
          </section>

          {/* Current Objective */}
          <Card title="Current Priority Directive" variant="highlight" className="objective-card">
            <p className="objective-text">"{dynamicObjective}"</p>
            <div className="objective-action">
              <Button onClick={() => onNavigate(objectiveActionTarget)}>
                {objectiveActionLabel} →
              </Button>
              <Button variant="default" onClick={() => onNavigate('case-file')}>
                Full Case File
              </Button>
            </div>
          </Card>

          {/* Dynamic Statistics Grid */}
          <div className="stats-grid">
            <Card className="stat-card" onClick={() => onNavigate('evidence')}>
              <div className="stat-value">
                {discoveredCount < 10 ? `0${discoveredCount}` : discoveredCount}
                <span className="stat-max">/0{totalClues}</span>
              </div>
              <div className="stat-label">CLUES FOUND</div>
            </Card>

            <Card className="stat-card" onClick={() => onNavigate('suspects')}>
              <div className="stat-value">
                {questionedSuspectsCount < 10 ? `0${questionedSuspectsCount}` : questionedSuspectsCount}
                <span className="stat-max">/0{totalSuspects}</span>
              </div>
              <div className="stat-label">QUESTIONED</div>
            </Card>

            <Card className="stat-card" onClick={() => onNavigate('locations')}>
              <div className="stat-value">
                {investigatedLocationsCount < 10 ? `0${investigatedLocationsCount}` : investigatedLocationsCount}
                <span className="stat-max">/0{totalLocations}</span>
              </div>
              <div className="stat-label">SECTORS SEARCHED</div>
            </Card>

            <Card className="stat-card" onClick={() => onNavigate('investigation-board')}>
              <div className="stat-value">
                {connections.length < 10 ? `0${connections.length}` : connections.length}
              </div>
              <div className="stat-label">BOARD THREADS</div>
            </Card>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="quick-nav-section">
            <h3 className="section-title">Case Operations Navigation</h3>
            <div className="quick-nav-grid">
              <div className="quick-nav-tile" onClick={() => onNavigate('locations')}>
                <div className="tile-icon">📍</div>
                <div className="tile-info">
                  <strong>Search Locations</strong>
                  <span>{totalLocations - investigatedLocationsCount} sectors unexamined</span>
                </div>
              </div>

              <div className="quick-nav-tile" onClick={() => onNavigate('evidence')}>
                <div className="tile-icon">🔬</div>
                <div className="tile-info">
                  <strong>Evidence Lab</strong>
                  <span>{discoveredCount} recovered ({inspectedCount} inspected, {analyzedCount} analyzed)</span>
                </div>
              </div>

              <div className="quick-nav-tile" onClick={() => onNavigate('interrogation')}>
                <div className="tile-icon">🎙️</div>
                <div className="tile-info">
                  <strong>Interrogation</strong>
                  <span>{completedQuestions.length} questions on record</span>
                </div>
              </div>

              <div className="quick-nav-tile" onClick={() => onNavigate('investigation-board')}>
                <div className="tile-icon">📌</div>
                <div className="tile-info">
                  <strong>Pin Board</strong>
                  <span>{connections.length} threads mapped</span>
                </div>
              </div>

              <div className="quick-nav-tile" onClick={() => onNavigate('timeline')}>
                <div className="tile-icon">🕒</div>
                <div className="tile-info">
                  <strong>Crime Timeline</strong>
                  <span>6 chronological milestones</span>
                </div>
              </div>

              <div className="quick-nav-tile tile-highlight" onClick={() => onNavigate('deduction')}>
                <div className="tile-icon">⚖️</div>
                <div className="tile-info">
                  <strong>Submit Deduction</strong>
                  <span>File formal accusation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-right">
          {/* Latest Discovery Card */}
          <Card title="Latest Evidence Discovery" className="discovery-card">
            {latestDiscovery ? (
              <>
                <div className="discovery-header">
                  <span className="discovery-id">Clue #{latestDiscovery.id}</span>
                  <span className="discovery-type-chip">{latestDiscovery.type}</span>
                </div>
                <h4 className="discovery-name">{latestDiscovery.name}</h4>
                <div className="discovery-details">
                  <div className="detail-row">
                    <span className="detail-label">Found at:</span>
                    <span className="detail-value">{latestDiscovery.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value ${latestDiscovery.status === 'Analyzed' ? 'text-green' : 'warning'}`}>
                      {latestDiscovery.status}
                    </span>
                  </div>
                  <p className="discovery-snippet">{latestDiscovery.description}</p>
                </div>
                <button className="view-evidence-btn" onClick={() => onNavigate('evidence')}>
                  Examine Clue in Detail →
                </button>
              </>
            ) : (
              <div className="empty-discovery-prompt">
                <span className="empty-icon">🔍</span>
                <p>No clues uncovered yet.</p>
                <span className="empty-hint">Search the Living Room, Balcony, Security Room, or Guest Room.</span>
                <button className="start-search-btn" onClick={() => onNavigate('locations')}>
                  Search Locations Now
                </button>
              </div>
            )}
          </Card>

          {/* Investigation Progress Breakdown */}
          <Card title="Investigation Status" className="status-card">
            <div className="status-list">
              <ProgressBar 
                label="Clues Recovered" 
                value={discoveredCount} 
                max={totalClues} 
              />
              <ProgressBar 
                label="Forensic Analyses" 
                value={analyzedCount} 
                max={totalClues} 
              />
              <ProgressBar 
                label="Sectors Investigated" 
                value={investigatedLocationsCount} 
                max={totalLocations} 
              />
              <ProgressBar 
                label="Suspects Deposed" 
                value={questionedSuspectsCount} 
                max={totalSuspects} 
              />
              <ProgressBar 
                label="Overall Progress" 
                value={progress} 
                max={100} 
              />
            </div>
          </Card>
        </div>
      </div>
    </GameLayout>
  );
};

export default Dashboard;
