import React, { useState } from 'react';
import GameLayout from '../components/layout/GameLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { caseData } from '../data/caseData';
import './Timeline.css';

const Timeline = ({ 
  onNavigate, 
  progress = 0,
  timelineList = caseData.timelineList || [], 
  notesList = [], 
  onAddNote 
}) => {
  // React State: Tracks the currently selected timeline event ID (defaults to first event)
  const [selectedEventId, setSelectedEventId] = useState(
    timelineList.length > 0 ? timelineList[0].id : null
  );

  // React State: Filter mode for timeline ('all' | 'suspicious' | 'verified')
  const [filterMode, setFilterMode] = useState('all');

  // React State: Brief feedback toast after saving an event to Detective Notes
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Find the selected event object from the list using the ID stored in state
  const selectedEvent = timelineList.find(e => e.id === selectedEventId) || timelineList[0];

  // Helper function to check if a timeline event is already saved in Detective Notes
  const isEventSavedInNotes = (event) => {
    if (!event) return false;
    return notesList.some(
      note => note.id === `NOTE-${event.id}` || note.title === `Timeline: ${event.title}`
    );
  };

  // Event handler for "SAVE TO NOTES" button
  const handleSaveToNotes = (event, e) => {
    if (e) e.stopPropagation();
    if (!event) return;

    if (isEventSavedInNotes(event)) {
      setFeedbackToast(`"${event.title}" is already recorded in your notes.`);
      setTimeout(() => setFeedbackToast(null), 3000);
      return;
    }

    const newNote = {
      id: `NOTE-${event.id}`,
      time: event.time,
      category: event.isSuspicious ? 'Suspicious Lead' : 'Timeline Log',
      title: `Timeline: ${event.title}`,
      content: `[${event.time} @ ${event.location}] ${event.description} | Status: ${event.status}. Detective Review: ${event.notes || 'Chronological case observation.'}`
    };

    if (onAddNote) {
      onAddNote(newNote);
    }

    setFeedbackToast(`Saved "${event.title}" to Detective Notes.`);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Filter events based on active filterMode
  const filteredEvents = timelineList.filter(item => {
    if (filterMode === 'suspicious') return item.isSuspicious;
    if (filterMode === 'verified') return !item.isSuspicious;
    return true;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Corroborated':
      case 'Verified Log':
        return 'status-verified';
      case 'System Flagged':
        return 'status-flagged';
      case 'Under Review':
        return 'status-warning';
      case 'Active Lead':
      case 'Active':
        return 'status-active';
      default:
        return 'status-active';
    }
  };

  const getSuspicionClass = (item) => {
    if (!item.isSuspicious) return '';
    return item.suspicionLevel === 'red' ? 'suspicious-red' : 'suspicious-amber';
  };

  const suspiciousCount = timelineList.filter(item => item.isSuspicious).length;

  return (
    <GameLayout activeItem="timeline" onNavigate={onNavigate} progress={progress}>
      <div className="timeline-page">
        {/* Page Header */}
        <header className="page-header">
          <div className="header-titles">
            <h1 className="page-title">CRIME TIMELINE</h1>
            <h2 className="page-subtitle">CASE #{caseData.id} — CHRONOLOGICAL INCIDENT SEQUENCE</h2>
          </div>
          <div className="header-meta">
            <p className="page-tagline">"Time is a silent witness. Sequence reveals the contradiction."</p>
            <div className="evidence-count">
              <span className="count-number">0{timelineList.length}</span> Total Events
            </div>
          </div>
        </header>

        {/* Mandatory Case Disclaimer Banner */}
        <div className="timeline-disclaimer-banner">
          <div className="disclaimer-badge">
            <span className="disclaimer-icon">ℹ</span>
            <span>PRELIMINARY CHRONOLOGY</span>
          </div>
          <p className="disclaimer-text">
            All timeline records represent preliminary witness accounts and automated facility logs.
            <strong> Flagged suspicious events warrant investigative scrutiny, not confirmed proof of guilt.</strong>
          </p>
        </div>

        {/* Toast Feedback Notification */}
        {feedbackToast && (
          <div className="timeline-toast">
            <span className="toast-icon">✓</span>
            <span className="toast-text">{feedbackToast}</span>
          </div>
        )}

        {/* Filter Navigation Bar */}
        <div className="timeline-filter-bar">
          <div className="filter-group">
            <span className="filter-label">VIEW FILTER:</span>
            <button
              className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All Events ({timelineList.length})
            </button>
            <button
              className={`filter-btn ${filterMode === 'suspicious' ? 'active' : ''}`}
              onClick={() => setFilterMode('suspicious')}
            >
              <span className="dot dot-amber"></span>
              Suspicious Leads ({suspiciousCount})
            </button>
            <button
              className={`filter-btn ${filterMode === 'verified' ? 'active' : ''}`}
              onClick={() => setFilterMode('verified')}
            >
              <span className="dot dot-green"></span>
              Verified Logs ({timelineList.length - suspiciousCount})
            </button>
          </div>

          <div className="timeline-stats-summary">
            <span className="stat-pill">
              Notes Saved: {notesList.filter(n => n.id?.startsWith('NOTE-T')).length}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="timeline-content-area">
          {/* Vertical Chronological Timeline */}
          <div className="timeline-list">
            <div className="timeline-rail"></div>

            {filteredEvents.map((item, index) => {
              const isSelected = selectedEvent?.id === item.id;
              const isSaved = isEventSavedInNotes(item);
              const suspicionClass = getSuspicionClass(item);

              return (
                <div
                  key={item.id}
                  className={`timeline-item ${isSelected ? 'selected' : ''} ${suspicionClass}`}
                  onClick={() => setSelectedEventId(item.id)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedEventId(item.id);
                    }
                  }}
                >
                  {/* Timeline Connecting Node Dot */}
                  <div className={`timeline-node ${suspicionClass} ${isSelected ? 'node-selected' : ''}`}>
                    <span className="node-dot"></span>
                    <span className="node-pulse"></span>
                  </div>

                  {/* Left Column: Chronological Timestamp & Status */}
                  <div className="timeline-time-col">
                    <span className="timeline-time">{item.time}</span>
                    <span className="timeline-order-badge">#{String(index + 1).padStart(2, '0')}</span>
                    <span className={`timeline-status-pill ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Main Event Body */}
                  <div className="timeline-body-col">
                    <div className="timeline-item-header">
                      <div className="title-and-type">
                        <span className="timeline-type-badge">{item.type}</span>
                        <h3 className="timeline-event-title">{item.title}</h3>
                      </div>

                      {item.isSuspicious && (
                        <span className={`suspicious-tag ${item.suspicionLevel === 'red' ? 'tag-red' : 'tag-amber'}`}>
                          {item.suspicionLevel === 'red' ? 'CRITICAL ANOMALY' : 'SCRUTINY REQUIRED'}
                        </span>
                      )}
                    </div>

                    <p className="timeline-desc">{item.description}</p>

                    <div className="timeline-item-footer">
                      <span className="timeline-location-tag">
                        📍 {item.location}
                      </span>

                      <button
                        className={`save-note-btn ${isSaved ? 'saved' : ''}`}
                        onClick={(e) => handleSaveToNotes(item, e)}
                        title={isSaved ? 'Already saved in case notes' : 'Save to case notes'}
                      >
                        {isSaved ? '✓ SAVED' : '📝 SAVE NOTE'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div className="empty-timeline-message">
                <p>No events match the selected filter.</p>
                <button className="reset-filter-btn" onClick={() => setFilterMode('all')}>
                  Show All Chronological Events
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Selected Event Dossier Panel */}
          <div className="timeline-detail-panel">
            {selectedEvent ? (
              <Card title="Event Dossier" className="timeline-detail-card">
                <div className="dossier-top-meta">
                  <span className="dossier-id">{selectedEvent.id}</span>
                  <span className="dossier-type-tag">{selectedEvent.type}</span>
                  <span className={`timeline-status-pill ${getStatusClass(selectedEvent.status)}`}>
                    {selectedEvent.status}
                  </span>
                </div>

                <h2 className="dossier-event-title">{selectedEvent.title}</h2>
                <div className="dossier-sub-info">
                  <span className="dossier-time">🕒 {selectedEvent.time}</span>
                  <span className="dossier-location">📍 {selectedEvent.location}</span>
                </div>

                {selectedEvent.isSuspicious && (
                  <div className={`suspicion-alert-box ${selectedEvent.suspicionLevel === 'red' ? 'alert-red' : 'alert-amber'}`}>
                    <div className="alert-header">
                      <span className="alert-icon">⚠️</span>
                      <strong className="alert-title">
                        {selectedEvent.suspicionLevel === 'red'
                          ? 'HIGH PRIORITY INVESTIGATION LEAD'
                          : 'CIRCUMSTANTIAL DISCREPANCY'}
                      </strong>
                    </div>
                    <p className="alert-content">{selectedEvent.suspicionNote}</p>
                    <p className="alert-disclaimer">
                      * Non-conclusive: This event warrants investigative priority but does not confirm culpability.
                    </p>
                  </div>
                )}

                <div className="dossier-sections">
                  <div className="dossier-field">
                    <span className="dossier-label">Chronological Narrative</span>
                    <p className="dossier-text">{selectedEvent.fullDescription || selectedEvent.description}</p>
                  </div>

                  <div className="dossier-field">
                    <span className="dossier-label">Individuals / Witnesses Observed</span>
                    <p className="dossier-value">{selectedEvent.witness || 'Under inquiry'}</p>
                  </div>

                  <div className="dossier-field">
                    <span className="dossier-label">Physical / Digital Corroboration</span>
                    <p className="dossier-value">{selectedEvent.investigativeLead || 'Awaiting forensic comparison.'}</p>
                  </div>

                  <div className="dossier-field">
                    <span className="dossier-label">Detective's Field Log</span>
                    <p className="dossier-value highlight-notes">{selectedEvent.notes}</p>
                  </div>
                </div>

                <div className="dossier-primary-action">
                  {isEventSavedInNotes(selectedEvent) ? (
                    <div className="saved-action-container">
                      <Button variant="default" className="saved-badge-btn" disabled>
                        ✓ SAVED TO CASE NOTES
                      </Button>
                      <button
                        className="jump-notes-link"
                        onClick={() => onNavigate('notes')}
                      >
                        Open Detective Notes →
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSaveToNotes(selectedEvent)}
                      variant={selectedEvent.isSuspicious ? 'primary' : 'default'}
                      className="save-dossier-btn"
                    >
                      📝 SAVE EVENT TO NOTES
                    </Button>
                  )}
                </div>

                <div className="dossier-nav-actions">
                  <span className="nav-actions-label">CROSS-INVESTIGATION HUBS:</span>
                  <div className="nav-btn-grid">
                    <Button variant="default" onClick={() => onNavigate('suspects')}>
                      Cross-Check Suspects
                    </Button>
                    <Button variant="default" onClick={() => onNavigate('locations')}>
                      Inspect Sectors
                    </Button>
                    <Button variant="default" onClick={() => onNavigate('evidence')}>
                      Review Evidence
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="empty-selection">
                <p>Select an event from the timeline to inspect details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default Timeline;
