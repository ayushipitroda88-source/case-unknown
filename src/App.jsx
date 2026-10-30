import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CaseFile from './pages/CaseFile';
import Evidence from './pages/Evidence';
import Suspects from './pages/Suspects';
import Locations from './pages/Locations';
import Timeline from './pages/Timeline';
import Interrogation from './pages/Interrogation';
import InvestigationBoard from './pages/InvestigationBoard';
import Deduction from './pages/Deduction';
import Result from './pages/Result';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import { initialCaseData } from './data/caseData';
import './App.css';

// Storage keys for persistent gameplay state
const STORAGE_KEYS = {
  EVIDENCE: 'case_unknown_evidence_v3',
  SUSPECTS: 'case_unknown_suspects_v3',
  LOCATIONS: 'case_unknown_locations_v3',
  NOTES: 'case_unknown_notes_v3',
  CONNECTIONS: 'case_unknown_connections_v3',
  QUESTIONS: 'case_unknown_questions_v3',
  DEDUCTION: 'case_unknown_deduction_v3',
  SETTINGS: 'case_unknown_settings_v3'
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  // Shared persistent game state: Evidence List
  const [evidenceList, setEvidenceList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
      return saved ? JSON.parse(saved) : initialCaseData.evidenceList;
    } catch (e) {
      return initialCaseData.evidenceList;
    }
  });

  // Suspects List
  const [suspectsList, setSuspectsList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUSPECTS);
      return saved ? JSON.parse(saved) : initialCaseData.suspectsList;
    } catch (e) {
      return initialCaseData.suspectsList;
    }
  });

  // Investigated Locations Array (e.g. ['L-01', 'L-02'])
  const [investigatedLocations, setInvestigatedLocations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Notes List
  const [notesList, setNotesList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : initialCaseData.notesList;
    } catch (e) {
      return initialCaseData.notesList;
    }
  });

  // Investigation Board Connections
  const [connections, setConnections] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
      return saved ? JSON.parse(saved) : (initialCaseData.initialConnections || []);
    } catch (e) {
      return initialCaseData.initialConnections || [];
    }
  });

  // Interrogation: Completed Question IDs
  const [completedQuestions, setCompletedQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Deduction Result / Outcome
  const [deductionResult, setDeductionResult] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEDUCTION);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // User Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : {
        soundEnabled: false,
        reducedMotion: false,
        textSize: 'normal',
        showHints: true
      };
    } catch (e) {
      return {
        soundEnabled: false,
        reducedMotion: false,
        textSize: 'normal',
        showHints: true
      };
    }
  });

  const [selectedSuspectId, setSelectedSuspectId] = useState(null);

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(evidenceList));
    } catch (e) {}
  }, [evidenceList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUSPECTS, JSON.stringify(suspectsList));
    } catch (e) {}
  }, [suspectsList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(investigatedLocations));
    } catch (e) {}
  }, [investigatedLocations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notesList));
    } catch (e) {}
  }, [notesList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
    } catch (e) {}
  }, [connections]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(completedQuestions));
    } catch (e) {}
  }, [completedQuestions]);

  useEffect(() => {
    try {
      if (deductionResult) {
        localStorage.setItem(STORAGE_KEYS.DEDUCTION, JSON.stringify(deductionResult));
      } else {
        localStorage.removeItem(STORAGE_KEYS.DEDUCTION);
      }
    } catch (e) {}
  }, [deductionResult]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {}

    // Apply settings classes to body
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    if (settings.textSize === 'large') {
      document.body.classList.add('text-size-large');
    } else {
      document.body.classList.remove('text-size-large');
    }
  }, [settings]);

  // Overall investigation progress calculation (0 - 100%)
  const calculateProgress = () => {
    const discovered = evidenceList.filter(e => e.discovered !== false).length;
    const inspected = evidenceList.filter(e => e.inspected === true).length;
    const analyzed = evidenceList.filter(e => e.status === 'Analyzed').length;
    const questioned = suspectsList.filter(s =>
      (s.questions || []).some(q => completedQuestions.includes(q.id)) || s.status === 'Questioned'
    ).length;
    const sectors = investigatedLocations.length;

    let prog = 0;
    prog += Math.round((discovered / evidenceList.length) * 25);
    prog += Math.round((inspected / evidenceList.length) * 10);
    prog += Math.round((analyzed / evidenceList.length) * 20);
    prog += Math.round((questioned / suspectsList.length) * 20);
    prog += Math.round((sectors / 4) * 15);
    prog += Math.min(connections.length * 5, 10);
    return Math.min(100, prog);
  };

  const currentProgress = calculateProgress();

  // Navigation handler
  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  // Evidence discovery handler (from Locations screen)
  const handleDiscoverClue = (clueId, locationId) => {
    let recoveredItemName = '';
    let recoveredItemLocation = '';

    setEvidenceList(prevList =>
      prevList.map(item => {
        if (item.id === clueId) {
          recoveredItemName = item.name;
          recoveredItemLocation = item.location;
          return {
            ...item,
            discovered: true,
            status: item.status === 'Undiscovered' ? 'Needs Analysis' : item.status,
            discoveryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return item;
      })
    );

    // Also mark location as investigated
    if (locationId) {
      setInvestigatedLocations(prev => prev.includes(locationId) ? prev : [...prev, locationId]);
    } else {
      // Find matching location from caseData
      const loc = initialCaseData.locationsList.find(l => l.clueId === clueId);
      if (loc) {
        setInvestigatedLocations(prev => prev.includes(loc.id) ? prev : [...prev, loc.id]);
      }
    }

    // Automatically record field log in Notes
    if (recoveredItemName) {
      const newNote = {
        id: `NOTE-EV-${clueId}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'Forensics',
        title: `Clue Recovered: ${recoveredItemName}`,
        content: `Recovered from ${recoveredItemLocation}. Ready for lab examination and spectrometry analysis.`
      };
      setNotesList(prev => [newNote, ...prev.filter(n => n.id !== newNote.id)]);
    }
  };

  // Evidence inspection handler (marks clue as inspected)
  const handleInspectEvidence = (evidenceId) => {
    setEvidenceList(prevList =>
      prevList.map(item =>
        item.id === evidenceId
          ? { ...item, inspected: true }
          : item
      )
    );
  };

  // Evidence status update handler (e.g. Mark as Analyzed in Crime Lab)
  const handleUpdateEvidenceStatus = (evidenceId, newStatus) => {
    setEvidenceList(prevList =>
      prevList.map(item =>
        item.id === evidenceId
          ? { ...item, status: newStatus, analyzed: newStatus === 'Analyzed', inspected: true }
          : item
      )
    );
  };

  // Sector investigation handler
  const handleInvestigateLocation = (locationId) => {
    if (!investigatedLocations.includes(locationId)) {
      setInvestigatedLocations(prev => [...prev, locationId]);
    }
  };

  // Interrogation questioning handler
  const handleAskQuestion = (suspectId, questionObj) => {
    if (!completedQuestions.includes(questionObj.id)) {
      setCompletedQuestions(prev => [...prev, questionObj.id]);

      // Update suspect's status
      setSuspectsList(prev =>
        prev.map(s =>
          s.id === suspectId
            ? { ...s, status: 'Questioned', questionedCount: (s.questionedCount || 0) + 1 }
            : s
        )
      );

      // Automatically add unlocked lead to case journal
      if (questionObj.unlockLead) {
        const suspect = suspectsList.find(s => s.id === suspectId);
        const newNote = {
          id: `NOTE-Q-${questionObj.id}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'Interrogation',
          title: `Deposition: ${suspect ? suspect.name : 'Suspect'}`,
          content: `Lead uncovered: "${questionObj.unlockLead}" (Response: "${questionObj.answer}")`
        };
        setNotesList(prev => [newNote, ...prev.filter(n => n.id !== newNote.id)]);
      }
    }
  };

  // Notes handlers
  const handleAddNote = (newNote) => {
    setNotesList(prev => [newNote, ...prev]);
  };

  const handleEditNote = (noteId, updatedData) => {
    setNotesList(prev =>
      prev.map(n => n.id === noteId ? { ...n, ...updatedData } : n)
    );
  };

  const handleDeleteNote = (noteId) => {
    setNotesList(prev => prev.filter(n => n.id !== noteId));
  };

  // Investigation board handlers
  const handleAddConnection = (newConnection) => {
    setConnections(prev => [newConnection, ...prev]);
  };

  const handleRemoveConnection = (connectionId) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
  };

  // Deduction submission
  const handleSubmitDeduction = (deductionPayload) => {
    setDeductionResult(deductionPayload);
    handleNavigate('result');
  };

  // Reset / Replay Case #001
  const handleResetCase = () => {
    setEvidenceList(initialCaseData.evidenceList);
    setSuspectsList(initialCaseData.suspectsList);
    setInvestigatedLocations([]);
    setNotesList(initialCaseData.notesList);
    setConnections(initialCaseData.initialConnections || []);
    setCompletedQuestions([]);
    setDeductionResult(null);
    setSelectedSuspectId(null);

    try {
      localStorage.removeItem(STORAGE_KEYS.EVIDENCE);
      localStorage.removeItem(STORAGE_KEYS.SUSPECTS);
      localStorage.removeItem(STORAGE_KEYS.LOCATIONS);
      localStorage.removeItem(STORAGE_KEYS.NOTES);
      localStorage.removeItem(STORAGE_KEYS.CONNECTIONS);
      localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
      localStorage.removeItem(STORAGE_KEYS.DEDUCTION);
    } catch (e) {}
  };

  // Start a fresh investigation from the Home screen
  const handleStartFreshInvestigation = () => {
    handleResetCase();
    handleNavigate('case-file');
  };

  // Settings update handler
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const handleSelectSuspect = (id) => {
    setSelectedSuspectId(id);
  };

  // Check if saved progress exists to offer Continue vs Fresh Start
  const hasSavedProgress = 
    evidenceList.some(e => e.discovered !== false) ||
    completedQuestions.length > 0 ||
    investigatedLocations.length > 0 ||
    notesList.length > 3 ||
    connections.length > 1;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <Home 
            onNavigate={handleNavigate} 
            hasSavedProgress={hasSavedProgress}
            onStartFresh={handleStartFreshInvestigation}
          />
        );

      case 'dashboard':
      case 'overview':
        return (
          <Dashboard 
            onNavigate={handleNavigate} 
            progress={currentProgress}
            evidenceList={evidenceList}
            suspectsList={suspectsList}
            investigatedLocations={investigatedLocations}
            completedQuestions={completedQuestions}
            connections={connections}
            notesList={notesList}
          />
        );

      case 'case-file':
      case 'casefile':
        return (
          <CaseFile 
            onNavigate={handleNavigate} 
            progress={currentProgress}
          />
        );

      case 'evidence':
        return (
          <Evidence 
            onNavigate={handleNavigate} 
            progress={currentProgress}
            evidenceList={evidenceList} 
            onInspectEvidence={handleInspectEvidence}
            onUpdateEvidenceStatus={handleUpdateEvidenceStatus} 
          />
        );

      case 'suspects':
        return (
          <Suspects 
            onNavigate={handleNavigate} 
            progress={currentProgress}
            suspectsList={suspectsList}
            evidenceList={evidenceList}
            completedQuestions={completedQuestions}
            onSelectSuspect={handleSelectSuspect}
          />
        );

      case 'locations':
        return (
          <Locations 
            onNavigate={handleNavigate} 
            progress={currentProgress}
            evidenceList={evidenceList} 
            investigatedLocations={investigatedLocations}
            onDiscoverClue={handleDiscoverClue} 
            onInvestigateLocation={handleInvestigateLocation}
          />
        );

      case 'timeline':
        return (
          <Timeline 
            onNavigate={handleNavigate} 
            progress={currentProgress}
            timelineList={initialCaseData.timelineList}
            notesList={notesList}
            onAddNote={handleAddNote}
          />
        );

      case 'interrogation':
        return (
          <Interrogation
            onNavigate={handleNavigate}
            progress={currentProgress}
            suspectsList={suspectsList}
            completedQuestions={completedQuestions}
            onAskQuestion={handleAskQuestion}
            selectedSuspectIdProp={selectedSuspectId}
          />
        );

      case 'investigation-board':
      case 'investigation_board':
      case 'board':
        return (
          <InvestigationBoard
            onNavigate={handleNavigate}
            progress={currentProgress}
            evidenceList={evidenceList}
            suspectsList={suspectsList}
            connections={connections}
            onAddConnection={handleAddConnection}
            onRemoveConnection={handleRemoveConnection}
          />
        );

      case 'deduction':
        return (
          <Deduction
            onNavigate={handleNavigate}
            progress={currentProgress}
            evidenceList={evidenceList}
            suspectsList={suspectsList}
            timelineList={initialCaseData.timelineList}
            notesList={notesList}
            completedQuestions={completedQuestions}
            connections={connections}
            onSubmitDeduction={handleSubmitDeduction}
          />
        );

      case 'result':
        return (
          <Result
            onNavigate={handleNavigate}
            progress={currentProgress}
            deductionResult={deductionResult}
            evidenceList={evidenceList}
            suspectsList={suspectsList}
            completedQuestions={completedQuestions}
            connections={connections}
            onResetCase={handleResetCase}
          />
        );

      case 'notes':
        return (
          <Notes 
            onNavigate={handleNavigate} 
            progress={currentProgress}
            notesList={notesList}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        );

      case 'settings':
        return (
          <Settings
            onNavigate={handleNavigate}
            progress={currentProgress}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetCase={handleResetCase}
          />
        );

      default:
        return (
          <Dashboard 
            onNavigate={handleNavigate} 
            progress={currentProgress}
            evidenceList={evidenceList}
            suspectsList={suspectsList}
            investigatedLocations={investigatedLocations}
            completedQuestions={completedQuestions}
            connections={connections}
            notesList={notesList}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
    </div>
  );
}

export default App;
