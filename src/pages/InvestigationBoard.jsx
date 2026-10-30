import React, { useState } from 'react';
import GameLayout from '../components/layout/GameLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { caseData } from '../data/caseData';
import './InvestigationBoard.css';

const InvestigationBoard = ({
  onNavigate,
  progress = 0,
  evidenceList = caseData.evidenceList,
  suspectsList = caseData.suspectsList,
  connections = [],
  onAddConnection,
  onRemoveConnection
}) => {
  const [selectedFirstId, setSelectedFirstId] = useState(null);
  const [selectedSecondId, setSelectedSecondId] = useState(null);
  const [customRelationNote, setCustomRelationNote] = useState('');
  const [inspectedItem, setInspectedItem] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Combine items for the board: Discovered evidence + all suspects
  const boardEvidence = evidenceList.map(e => ({
    id: e.id,
    type: 'evidence',
    category: e.type,
    name: e.name,
    subtitle: e.location,
    status: e.status,
    discovered: e.discovered !== false,
    details: e.discovered !== false ? e.description : 'Undiscovered clue. Search the location to reveal.'
  }));

  const boardSuspects = suspectsList.map(s => ({
    id: s.id,
    type: 'suspect',
    category: s.role,
    name: s.name,
    subtitle: s.lastSeen,
    status: s.status,
    discovered: true,
    details: `${s.alibi} Motive: ${s.motive}`
  }));

  const allBoardItems = [...boardSuspects, ...boardEvidence];

  const getItem = (id) => allBoardItems.find(item => item.id === id);

  const handleItemClick = (item) => {
    setInspectedItem(item);

    if (!selectedFirstId) {
      setSelectedFirstId(item.id);
    } else if (selectedFirstId === item.id) {
      // Deselect if clicked again
      setSelectedFirstId(null);
    } else if (!selectedSecondId) {
      if (item.id !== selectedFirstId) {
        setSelectedSecondId(item.id);
      }
    } else if (selectedSecondId === item.id) {
      setSelectedSecondId(null);
    } else {
      // Pick as new second
      setSelectedSecondId(item.id);
    }
  };

  const handleClearSelection = () => {
    setSelectedFirstId(null);
    setSelectedSecondId(null);
    setCustomRelationNote('');
  };

  const handleCreateConnection = () => {
    if (!selectedFirstId || !selectedSecondId) return;

    const itemA = getItem(selectedFirstId);
    const itemB = getItem(selectedSecondId);
    if (!itemA || !itemB) return;

    // Check duplicate
    const exists = connections.some(c =>
      (c.fromId === itemA.id && c.toId === itemB.id) ||
      (c.fromId === itemB.id && c.toId === itemA.id)
    );

    if (exists) {
      setFeedbackMsg(`A link between ${itemA.name} and ${itemB.name} already exists.`);
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    const newConnection = {
      id: `C-${Date.now().toString().slice(-4)}`,
      fromId: itemA.id,
      fromTitle: itemA.name,
      toId: itemB.id,
      toTitle: itemB.name,
      notes: customRelationNote.trim() || `Hypothesized connection between ${itemA.name} and ${itemB.name}.`,
      createdAt: 'Just Now'
    };

    if (onAddConnection) {
      onAddConnection(newConnection);
    }

    setFeedbackMsg(`Linked "${itemA.name}" ↔ "${itemB.name}" with red string.`);
    setTimeout(() => setFeedbackMsg(null), 3000);

    handleClearSelection();
  };

  const isConnected = (id) => {
    return connections.some(c => c.fromId === id || c.toId === id);
  };

  const firstItem = getItem(selectedFirstId);
  const secondItem = getItem(selectedSecondId);

  return (
    <GameLayout activeItem="investigation-board" onNavigate={onNavigate} progress={progress}>
      <div className="board-page">
        {/* Page Header */}
        <header className="page-header">
          <div className="header-titles">
            <h1 className="page-title">INVESTIGATION BOARD</h1>
            <h2 className="page-subtitle">CASE #{caseData.id} — EVIDENCE PIN-BOARD & HYPOTHESIS MAPPING</h2>
          </div>
          <div className="header-meta">
            <p className="page-tagline">"Connect the pieces. Unmask the motive."</p>
            <div className="board-stat-pill">
              <span className="red-string-dot"></span>
              {connections.length} Active Strings
            </div>
          </div>
        </header>

        {feedbackMsg && (
          <div className="board-toast">
            <span className="toast-icon">📌</span>
            <span>{feedbackMsg}</span>
          </div>
        )}

        <div className="board-layout">
          {/* Main Pin Board Surface */}
          <div className="pinboard-surface">
            <div className="pinboard-overlay"></div>

            {/* Instruction helper strip */}
            <div className="board-instruction-banner">
              <div className="instruction-badge">HOW TO CONNECT</div>
              <span>Click any two cards to link them with a detective thread. Inspect card details on the right.</span>
            </div>

            {/* Suspects Section */}
            <div className="board-section-group">
              <div className="group-heading">
                <span className="pin-head yellow-pin"></span>
                <span className="group-title">SUSPECTS & WITNESSES</span>
              </div>
              <div className="board-cards-grid">
                {boardSuspects.map(item => {
                  const isSelected = selectedFirstId === item.id || selectedSecondId === item.id;
                  const hasLinks = isConnected(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`pinned-card suspect-pinned ${isSelected ? 'selected' : ''} ${hasLinks ? 'has-threads' : ''}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="card-pushpin red-pin"></div>
                      <div className="pinned-card-header">
                        <span className="pinned-id">{item.id}</span>
                        <span className="pinned-category">{item.category}</span>
                      </div>
                      <h4 className="pinned-name">{item.name}</h4>
                      <p className="pinned-sub">Last Seen: {item.subtitle}</p>
                      <div className="pinned-footer">
                        <span className={`pinned-status-chip ${item.status === 'Questioned' ? 'status-ok' : ''}`}>
                          {item.status}
                        </span>
                        {hasLinks && <span className="string-count-badge">Connected</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evidence Section */}
            <div className="board-section-group">
              <div className="group-heading">
                <span className="pin-head red-pin"></span>
                <span className="group-title">RECOVERED FORENSIC EVIDENCE</span>
              </div>
              <div className="board-cards-grid">
                {boardEvidence.map(item => {
                  const isSelected = selectedFirstId === item.id || selectedSecondId === item.id;
                  const hasLinks = isConnected(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`pinned-card evidence-pinned ${isSelected ? 'selected' : ''} ${!item.discovered ? 'undiscovered-card' : ''} ${hasLinks ? 'has-threads' : ''}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="card-pushpin bronze-pin"></div>
                      <div className="pinned-card-header">
                        <span className="pinned-id">{item.id}</span>
                        <span className="pinned-category">{item.category}</span>
                      </div>
                      <h4 className="pinned-name">{item.name}</h4>
                      <p className="pinned-sub">Location: {item.subtitle}</p>
                      <div className="pinned-footer">
                        <span className="pinned-status-chip">
                          {item.discovered ? item.status : 'Undiscovered'}
                        </span>
                        {hasLinks && <span className="string-count-badge">Connected</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Connection Creator & Thread Manager */}
          <div className="board-sidebar-col">
            {/* Connection Builder Panel */}
            <Card title="Red String Connector" className="connector-panel">
              <div className="connector-slots">
                <div className={`connect-slot ${firstItem ? 'filled' : 'empty'}`}>
                  <span className="slot-label">ITEM 1</span>
                  {firstItem ? (
                    <div className="slot-data">
                      <strong className="slot-name">{firstItem.name}</strong>
                      <span className="slot-type">{firstItem.category}</span>
                    </div>
                  ) : (
                    <span className="slot-placeholder">Click an item to select</span>
                  )}
                </div>

                <div className="connect-divider-icon">↔</div>

                <div className={`connect-slot ${secondItem ? 'filled' : 'empty'}`}>
                  <span className="slot-label">ITEM 2</span>
                  {secondItem ? (
                    <div className="slot-data">
                      <strong className="slot-name">{secondItem.name}</strong>
                      <span className="slot-type">{secondItem.category}</span>
                    </div>
                  ) : (
                    <span className="slot-placeholder">Click a 2nd item</span>
                  )}
                </div>
              </div>

              {firstItem && secondItem && (
                <div className="connection-form">
                  <label className="form-label">Hypothesis / Link Note</label>
                  <input
                    type="text"
                    className="form-input connection-input"
                    placeholder="e.g. Watch fabric matches uniform..."
                    value={customRelationNote}
                    onChange={(e) => setCustomRelationNote(e.target.value)}
                  />
                  <div className="connector-actions">
                    <Button onClick={handleCreateConnection}>
                      LINK WITH RED STRING
                    </Button>
                    <Button variant="default" onClick={handleClearSelection}>
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Active Connections List */}
            <Card title={`Active Threads (${connections.length})`} className="threads-panel">
              {connections.length > 0 ? (
                <div className="threads-list">
                  {connections.map(conn => (
                    <div key={conn.id} className="thread-item">
                      <div className="thread-header">
                        <div className="thread-nodes">
                          <span className="thread-node-name">{conn.fromTitle}</span>
                          <span className="thread-arrow">───────</span>
                          <span className="thread-node-name">{conn.toTitle}</span>
                        </div>
                        <button
                          className="btn-remove-thread"
                          onClick={() => onRemoveConnection && onRemoveConnection(conn.id)}
                          title="Remove thread"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="thread-notes">{conn.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-threads">
                  <span className="empty-icon">🧶</span>
                  <p>No active connections established.</p>
                  <span className="empty-sub">Select two cards to formulate deductive links.</span>
                </div>
              )}
            </Card>

            {/* Item Inspector Panel */}
            {inspectedItem && (
              <Card title="Inspected Dossier" className="inspector-panel">
                <div className="inspector-header">
                  <span className="inspector-id">{inspectedItem.id}</span>
                  <span className="inspector-category">{inspectedItem.category}</span>
                </div>
                <h4 className="inspector-name">{inspectedItem.name}</h4>
                <p className="inspector-desc">{inspectedItem.details}</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default InvestigationBoard;

