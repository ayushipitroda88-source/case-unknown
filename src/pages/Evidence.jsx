import React, { useState } from 'react';
import GameLayout from '../components/layout/GameLayout';
import EvidenceCard from '../components/investigation/EvidenceCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { caseData } from '../data/caseData';
import './Evidence.css';

const Evidence = ({ 
  onNavigate, 
  progress = 0,
  evidenceList = caseData.evidenceList, 
  onInspectEvidence,
  onUpdateEvidenceStatus 
}) => {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(
    evidenceList.length > 0 ? evidenceList[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [analyzingId, setAnalyzingId] = useState(null);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  const selectedEvidence = evidenceList.find(e => e.id === selectedEvidenceId);
  const discoveredCount = evidenceList.filter(e => e.discovered !== false).length;
  const inspectedCount = evidenceList.filter(e => e.inspected === true).length;
  const analyzedCount = evidenceList.filter(e => e.status === 'Analyzed').length;

  const handleEvidenceClick = (evidence) => {
    setSelectedEvidenceId(evidence.id);
    if (evidence.discovered !== false && onInspectEvidence) {
      onInspectEvidence(evidence.id);
    }
  };

  const handleOpenModal = () => {
    if (selectedEvidence && selectedEvidence.discovered !== false) {
      if (onInspectEvidence) {
        onInspectEvidence(selectedEvidence.id);
      }
      setShowInspectionModal(true);
    }
  };

  const handleMarkAnalyzed = () => {
    if (!selectedEvidence) return;
    setAnalyzingId(selectedEvidence.id);

    setTimeout(() => {
      if (onUpdateEvidenceStatus) {
        onUpdateEvidenceStatus(selectedEvidence.id, 'Analyzed');
      }
      setAnalyzingId(null);
    }, 700);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Analyzed': return 'text-analyzed';
      case 'Needs Analysis': return 'text-needs-analysis';
      case 'Unidentified': return 'text-unidentified';
      case 'Undiscovered': return 'text-undiscovered';
      default: return 'text-needs-analysis';
    }
  };

  // Filter and search
  const filteredEvidence = evidenceList.filter(item => {
    // Search query match
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Filter type match
    if (filterType === 'ALL') return true;
    if (filterType === 'DISCOVERED') return item.discovered !== false;
    if (filterType === 'INSPECTED') return item.inspected === true;
    if (filterType === 'NEEDS_ANALYSIS') return item.status === 'Needs Analysis';
    if (filterType === 'ANALYZED') return item.status === 'Analyzed';
    if (filterType === 'UNDISCOVERED') return item.discovered === false;
    if (filterType === 'PHYSICAL') return item.type.toLowerCase().includes('physical');
    if (filterType === 'DIGITAL') return item.type.toLowerCase().includes('digital');
    return true;
  });

  return (
    <GameLayout activeItem="evidence" onNavigate={onNavigate} progress={progress}>
      <div className="evidence-page">
        {/* Page Header */}
        <header className="page-header">
          <div className="header-titles">
            <h1 className="page-title">EVIDENCE LAB</h1>
            <h2 className="page-subtitle">CASE #{caseData.id} — FORENSIC VAULT & ANALYSIS</h2>
          </div>
          <div className="header-meta">
            <p className="page-tagline">"Every piece of evidence tells part of the story."</p>
            <div className="evidence-count-badge">
              <span className="count-group">
                <span className="count-number">0{discoveredCount} / 0{evidenceList.length}</span> Discovered
              </span>
              <span className="count-divider">•</span>
              <span className="count-group">
                <span className="count-number highlight-amber">0{inspectedCount}</span> Inspected
              </span>
              <span className="count-divider">•</span>
              <span className="count-group">
                <span className="count-number text-green">0{analyzedCount}</span> Analyzed
              </span>
            </div>
          </div>
        </header>

        {/* Filter and Search Bar */}
        <div className="evidence-control-bar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="evidence-search-input"
              placeholder="Search evidence by name, location, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="filter-chips-wrap">
            <span className="filter-label">FILTER:</span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'DISCOVERED', label: 'Discovered' },
              { id: 'INSPECTED', label: 'Inspected' },
              { id: 'NEEDS_ANALYSIS', label: 'Needs Lab' },
              { id: 'ANALYZED', label: 'Analyzed' },
              { id: 'UNDISCOVERED', label: 'Undiscovered' },
              { id: 'PHYSICAL', label: 'Physical' },
              { id: 'DIGITAL', label: 'Digital' }
            ].map(f => (
              <button
                key={f.id}
                className={`filter-chip ${filterType === f.id ? 'active' : ''}`}
                onClick={() => setFilterType(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="evidence-content-area">
          {/* Evidence Grid */}
          <div className="evidence-grid">
            {filteredEvidence.map(evidence => (
              <EvidenceCard 
                key={evidence.id}
                evidence={evidence}
                isSelected={selectedEvidenceId === evidence.id}
                onClick={handleEvidenceClick}
              />
            ))}

            {filteredEvidence.length === 0 && (
              <div className="empty-search-box">
                <span className="empty-icon">📂</span>
                <p>No evidence matches your search criteria.</p>
                <button className="reset-filter-btn" onClick={() => { setSearchQuery(''); setFilterType('ALL'); }}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="evidence-detail-panel">
            {selectedEvidence ? (
              <Card title="Forensic Examination" className="detail-card">
                <div className="detail-header">
                  <span className="detail-id">{selectedEvidence.id}</span>
                  <div className="detail-tags-row">
                    {selectedEvidence.inspected && (
                      <span className="tag-inspected">INSPECTED</span>
                    )}
                    <span className={`detail-status ${getStatusClass(selectedEvidence.status)}`}>
                      {selectedEvidence.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="detail-name">{selectedEvidence.name}</h3>
                
                <div className="detail-visual-large" onClick={handleOpenModal} style={{ cursor: selectedEvidence.discovered ? 'pointer' : 'default' }}>
                  <div className="visual-scanline"></div>
                  <span className="visual-text">
                    {selectedEvidence.discovered === false ? 'AWAITING RECOVERY • UNDISCOVERED' : 
                     selectedEvidence.status === 'Analyzed' ? 'LAB ANALYSIS VERIFIED • CLICK TO EXPAND' : 'CLICK TO EXPAND INSPECTION MODAL'}
                  </span>
                </div>

                <div className="detail-info-grid">
                  <div className="info-group">
                    <span className="info-label">Category / Type</span>
                    <span className="info-value">{selectedEvidence.type}</span>
                  </div>
                  <div className="info-group">
                    <span className="info-label">Discovery Sector</span>
                    <span className="info-value">{selectedEvidence.location}</span>
                  </div>
                </div>

                <div className="detail-description-box">
                  <span className="info-label">Description & Field Observations</span>
                  <p className="detail-description">
                    {selectedEvidence.discovered === false
                      ? `This clue has not yet been discovered. Search the ${selectedEvidence.location} in the Locations sector to uncover and collect it.`
                      : selectedEvidence.description}
                  </p>
                </div>

                {/* Forensic Analysis Details (when analyzed) */}
                {selectedEvidence.status === 'Analyzed' && (
                  <div className="forensic-report-box">
                    <div className="report-header">
                      <span className="report-stamp">CRIME LAB FORENSIC DOSSIER</span>
                    </div>
                    <p className="report-text">
                      {selectedEvidence.analysisDetails || "Microscopic and digital tests confirm authenticity and cross-reference with case timeline."}
                    </p>
                  </div>
                )}

                <div className="detail-actions-column">
                  {selectedEvidence.discovered === false ? (
                    <Button onClick={() => onNavigate('locations')}>
                      GO TO LOCATIONS TO RECOVER
                    </Button>
                  ) : (
                    <>
                      <button 
                        className="btn-expand-modal"
                        onClick={handleOpenModal}
                      >
                        🔍 EXPAND FULLSCREEN INSPECTION MODAL
                      </button>

                      {selectedEvidence.status === 'Analyzed' ? (
                        <div className="analyzed-complete-bar">
                          <span className="check-icon">✓</span>
                          <span>LAB ANALYSIS LOGGED</span>
                        </div>
                      ) : (
                        <Button onClick={handleMarkAnalyzed} disabled={analyzingId === selectedEvidence.id}>
                          {analyzingId === selectedEvidence.id ? 'RUNNING SPECTROMETRY SCAN...' : '🔬 MARK AS ANALYZED'}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </Card>
            ) : (
              <div className="empty-selection">
                <div className="empty-icon">🔍</div>
                <p>Select evidence card to inspect forensic details.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Evidence Inspection Modal */}
      {showInspectionModal && selectedEvidence && (
        <div className="evidence-modal-overlay" onClick={() => setShowInspectionModal(false)}>
          <div className="evidence-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-titles">
                <span className="modal-clue-id">CLUE #{selectedEvidence.id}</span>
                <h2 className="modal-clue-name">{selectedEvidence.name}</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setShowInspectionModal(false)}>✕</button>
            </div>

            <div className="modal-body-grid">
              <div className="modal-visual-side">
                <div className="modal-magnifier-screen">
                  <div className="magnifier-grid"></div>
                  <div className="visual-scanline"></div>
                  <div className="magnifier-reticle"></div>
                  <span className="magnifier-status">HIGH RES SPECTRO-SCAN • 400x ZOOM</span>
                </div>
                <div className="modal-meta-table">
                  <div className="table-row">
                    <span>SECTOR FOUND:</span>
                    <strong>{selectedEvidence.location}</strong>
                  </div>
                  <div className="table-row">
                    <span>CATEGORY:</span>
                    <strong>{selectedEvidence.type}</strong>
                  </div>
                  <div className="table-row">
                    <span>DISCOVERY STATUS:</span>
                    <strong className="text-green">RECOVERED</strong>
                  </div>
                  <div className="table-row">
                    <span>INSPECTION STATUS:</span>
                    <strong className="highlight-amber">INSPECTED</strong>
                  </div>
                  <div className="table-row">
                    <span>LAB ANALYSIS:</span>
                    <strong className={selectedEvidence.status === 'Analyzed' ? 'text-green' : 'text-neutral'}>
                      {selectedEvidence.status}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="modal-text-side">
                <div className="modal-section">
                  <h4 className="modal-section-title">Field Observations:</h4>
                  <p className="modal-text-desc">{selectedEvidence.description}</p>
                </div>

                <div className="modal-section">
                  <h4 className="modal-section-title">Crime Lab Spectrometry Report:</h4>
                  <p className="modal-text-desc lab-text">
                    {selectedEvidence.analysisDetails}
                  </p>
                </div>

                <div className="modal-actions-strip">
                  {selectedEvidence.status !== 'Analyzed' ? (
                    <Button onClick={handleMarkAnalyzed} disabled={analyzingId === selectedEvidence.id}>
                      {analyzingId === selectedEvidence.id ? 'RUNNING SCAN...' : '🔬 CONDUCT FORENSIC ANALYSIS'}
                    </Button>
                  ) : (
                    <div className="analyzed-complete-bar">
                      <span className="check-icon">✓</span>
                      <span>LAB ANALYSIS COMPLETE</span>
                    </div>
                  )}
                  <Button variant="default" onClick={() => setShowInspectionModal(false)}>
                    Close Inspector
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </GameLayout>
  );
};

export default Evidence;
