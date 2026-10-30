import React, { useState } from 'react';
import GameLayout from '../components/layout/GameLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { caseData } from '../data/caseData';
import './Locations.css';

const Locations = ({ 
  onNavigate, 
  progress = 0,
  evidenceList = caseData.evidenceList, 
  investigatedLocations = [],
  onDiscoverClue,
  onInvestigateLocation
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [justDiscoveredId, setJustDiscoveredId] = useState(null);

  const locations = caseData.locationsList || [];

  // Find the selected location object if in detail view
  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);

  // Compute overall investigation progress from shared evidenceList
  const totalCluesCount = evidenceList.length;
  const discoveredCluesCount = evidenceList.filter(e => e.discovered !== false).length;
  const progressPercent = totalCluesCount > 0 ? (discoveredCluesCount / totalCluesCount) * 100 : 0;

  // Helper to find the clue associated with a location
  const getClueForLocation = (location) => {
    return evidenceList.find(e => 
      e.id === location.clueId || 
      e.location.toLowerCase() === location.name.toLowerCase()
    );
  };

  const isLocationInvestigated = (location) => {
    const clue = getClueForLocation(location);
    return (
      investigatedLocations.includes(location.id) ||
      (clue && clue.discovered !== false)
    );
  };

  const handleSelectLocation = (locId) => {
    setSelectedLocationId(locId);
    if (onInvestigateLocation) {
      onInvestigateLocation(locId);
    }
  };

  const handleInvestigate = (clueId, locationId) => {
    if (!clueId) return;
    
    // Call the shared App state updater
    if (onDiscoverClue) {
      onDiscoverClue(clueId, locationId);
    }

    if (onInvestigateLocation && locationId) {
      onInvestigateLocation(locationId);
    }

    // Set local confirmation feedback state
    setJustDiscoveredId(clueId);
  };

  return (
    <GameLayout activeItem="locations" onNavigate={onNavigate} progress={progress}>
      <div className="locations-page">
        {/* Header */}
        <header className="page-header">
          <div className="header-titles">
            <h1 className="page-title">ESTATE SECTORS</h1>
            <h2 className="page-subtitle">CASE #{caseData.id} — CRIME SCENE SEARCH & INVESTIGATION</h2>
          </div>
          <div className="locations-progress-bar-container">
            <div className="locations-progress-text">
              Sector Search: <span className="locations-progress-highlight">{discoveredCluesCount} / {totalCluesCount}</span> Clues Uncovered
            </div>
            <div className="locations-progress-track">
              <div 
                className="locations-progress-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </header>

        {/* View Switching: Detail View vs 4-Locations Grid */}
        {selectedLocation ? (
          /* Location Investigation Detail View */
          <div className="location-detail-view">
            <div className="location-detail-nav">
              <Button 
                variant="default" 
                onClick={() => {
                  setSelectedLocationId(null);
                  setJustDiscoveredId(null);
                }}
              >
                ← BACK TO SECTOR SELECTION
              </Button>
              <Button variant="default" onClick={() => onNavigate('evidence')}>
                VIEW EVIDENCE LAB
              </Button>
            </div>

            <div className="location-detail-content">
              {/* Left Column: Location Info */}
              <Card title="Area Sector Dossier" className="location-overview-card">
                <div className="detail-location-header">
                  <div>
                    <h2 className="detail-location-name">{selectedLocation.name}</h2>
                    <span className="detail-location-type">{selectedLocation.type}</span>
                  </div>
                  {(() => {
                    const investigated = isLocationInvestigated(selectedLocation);
                    return (
                      <span className={`location-status-badge ${investigated ? 'status-badge-investigated' : 'status-badge-uninvestigated'}`}>
                        <span className="status-dot-indicator"></span>
                        {investigated ? 'INVESTIGATED' : 'UNINVESTIGATED'}
                      </span>
                    );
                  })()}
                </div>

                <div className="detail-description-section">
                  <div className="detail-desc-label">Location Description</div>
                  <p className="detail-desc-text">{selectedLocation.description}</p>
                </div>

                <div className="location-visual-large">
                  <div className="radar-sweep"></div>
                  <span className="sector-coordinates">LIVE DETECTIVE SCAN • {selectedLocation.id}</span>
                  <div className="visual-scanline"></div>
                </div>
              </Card>

              {/* Right Column: Available Clues */}
              <Card title="Available Sector Clues" className="location-clues-card">
                {(() => {
                  const clue = getClueForLocation(selectedLocation);
                  if (!clue) {
                    return <p className="detail-desc-text">No clues registered for this sector.</p>;
                  }

                  const isDiscovered = clue.discovered !== false;
                  const isJustDiscovered = justDiscoveredId === clue.id;

                  return (
                    <div className={`clue-item-card ${isDiscovered ? 'discovered' : 'undiscovered'}`}>
                      <div className="clue-item-header">
                        <span className="clue-item-id">{clue.id}</span>
                        <span className={`clue-status-pill ${isDiscovered ? 'pill-discovered' : 'pill-undiscovered'}`}>
                          {isDiscovered ? 'DISCOVERED' : 'AWAITING SEARCH'}
                        </span>
                      </div>

                      <div>
                        <h3 className="clue-item-name">{clue.name}</h3>
                        <span className="clue-item-type">{clue.type}</span>
                      </div>

                      {/* Confirmation Alert */}
                      {(isDiscovered || isJustDiscovered) && (
                        <div className="clue-confirmation-banner">
                          <span className="confirmation-icon">✓</span>
                          <span className="confirmation-message">
                            Clue Recovered: Added to Evidence Lab dossier.
                          </span>
                        </div>
                      )}

                      {/* Clue Description */}
                      <div className="clue-description-box">
                        <div className="detail-desc-label">Clue Observations</div>
                        <p className={`clue-description-text ${!isDiscovered ? 'unrevealed' : ''}`}>
                          {isDiscovered 
                            ? clue.description 
                            : 'An unexamined clue has been detected in this area. Click INVESTIGATE CLUE to recover it for lab analysis.'}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="clue-actions">
                        {isDiscovered ? (
                          <Button disabled className="btn-collected">
                            COLLECTED
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleInvestigate(clue.id, selectedLocation.id)}
                            className="btn-investigate"
                          >
                            INVESTIGATE CLUE
                          </Button>
                        )}
                        <Button variant="default" onClick={() => onNavigate('evidence')}>
                          VIEW IN EVIDENCE LAB
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </Card>
            </div>
          </div>
        ) : (
          /* Main 4-Locations Grid View */
          <div className="locations-grid-view">
            <div className="locations-four-grid">
              {locations.map(location => {
                const clue = getClueForLocation(location);
                const investigated = isLocationInvestigated(location);

                return (
                  <div
                    key={location.id}
                    className={`location-summary-card ${investigated ? 'investigated' : 'uninvestigated'}`}
                    onClick={() => handleSelectLocation(location.id)}
                  >
                    <div className="location-card-top">
                      <span className="location-sector-id">{location.id}</span>
                      <span className={`location-status-badge ${investigated ? 'status-badge-investigated' : 'status-badge-uninvestigated'}`}>
                        <span className="status-dot-indicator"></span>
                        {investigated ? 'INVESTIGATED' : 'UNINVESTIGATED'}
                      </span>
                    </div>

                    <div className="location-card-visual">
                      <div className="radar-sweep"></div>
                      <span className="sector-coordinates">SECTOR {location.id}</span>
                      <div className="visual-scanline"></div>
                    </div>

                    <div className="location-card-info">
                      <h3 className="location-card-title">{location.name}</h3>
                      <p className="location-card-short-desc">
                        {location.shortDescription || location.description}
                      </p>
                    </div>

                    <div className="location-card-footer">
                      <div className={`location-clue-indicator ${investigated ? 'clue-indicator-discovered' : 'clue-indicator-pending'}`}>
                        {clue && clue.discovered !== false ? (
                          <>✓ 1/1 Clues Discovered: {clue.name}</>
                        ) : (
                          <>⚠ 0/1 Clues Discovered</>
                        )}
                      </div>
                      <span className="location-enter-prompt">
                        Inspect Sector →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default Locations;
