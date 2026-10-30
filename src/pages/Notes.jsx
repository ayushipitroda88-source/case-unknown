import React, { useState } from 'react';
import GameLayout from '../components/layout/GameLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { caseData } from '../data/caseData';
import './Notes.css';

const Notes = ({ 
  onNavigate, 
  progress = 0,
  notesList = [], 
  onAddNote, 
  onEditNote, 
  onDeleteNote 
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Deduction');
  const [newContent, setNewContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Handle start edit
  const handleStartEdit = (note) => {
    setEditingNoteId(note.id);
    setNewTitle(note.title);
    setNewCategory(note.category || 'Deduction');
    setNewContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setNewTitle('');
    setNewCategory('Deduction');
    setNewContent('');
  };

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (editingNoteId) {
      if (onEditNote) {
        onEditNote(editingNoteId, {
          title: newTitle.trim(),
          category: newCategory,
          content: newContent.trim(),
          time: `Edited @ ${currentTimeString}`
        });
      }
      handleCancelEdit();
    } else {
      const newNote = {
        id: `N-${Date.now().toString().slice(-4)}`,
        time: currentTimeString,
        category: newCategory,
        title: newTitle.trim(),
        content: newContent.trim()
      };

      if (onAddNote) {
        onAddNote(newNote);
      }
      setNewTitle('');
      setNewContent('');
    }
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete field note "${title}"?`)) {
      if (onDeleteNote) {
        onDeleteNote(id);
      }
      if (editingNoteId === id) {
        handleCancelEdit();
      }
    }
  };

  const filteredNotes = notesList.filter(n => {
    if (categoryFilter === 'ALL') return true;
    return n.category === categoryFilter;
  });

  const categories = ['ALL', 'Deduction', 'Interrogation', 'Forensics', 'Clue Link', 'Timeline Log', 'Suspicious Lead'];

  return (
    <GameLayout activeItem="notes" onNavigate={onNavigate} progress={progress}>
      <div className="notes-page">
        {/* Page Header */}
        <header className="page-header">
          <div className="header-titles">
            <h1 className="page-title">DETECTIVE JOURNAL</h1>
            <h2 className="page-subtitle">CASE #{caseData.id} — CASE LOG & OBSERVATIONS</h2>
          </div>
          <div className="header-meta">
            <p className="page-tagline">"Thoughts on paper reveal patterns in chaos."</p>
            <div className="evidence-count-badge">
              <span className="count-number">{notesList.length < 10 ? `0${notesList.length}` : notesList.length}</span> Field Entries
            </div>
          </div>
        </header>

        {/* Category Filters */}
        <div className="notes-filter-bar">
          <span className="filter-label">CATEGORY:</span>
          <div className="category-chips">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-chip ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="notes-content-area">
          {/* Notes Grid */}
          <div className="notes-grid">
            {filteredNotes.map(note => {
              const isEditing = editingNoteId === note.id;

              return (
                <div key={note.id} className={`note-card ${isEditing ? 'editing-highlight' : ''}`}>
                  <div className="note-card-header">
                    <span className="note-category">{note.category}</span>
                    <span className="note-timestamp">{note.time}</span>
                  </div>
                  <h4 className="note-title">{note.title}</h4>
                  <p className="note-body">{note.content}</p>
                  
                  <div className="note-card-actions">
                    <button
                      className="note-action-btn edit-btn"
                      onClick={() => handleStartEdit(note)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="note-action-btn delete-btn"
                      onClick={() => handleDelete(note.id, note.title)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredNotes.length === 0 && (
              <div className="empty-notes-view">
                <span className="empty-icon">📝</span>
                <p className="empty-text">No notes found for this category.</p>
                <span className="empty-sub">
                  Add observations using the form on the right, or save entries directly from the Crime Timeline.
                </span>
              </div>
            )}
          </div>

          {/* New / Edit Note Form Panel */}
          <div className="notes-form-panel">
            <Card 
              title={editingNoteId ? "Edit Case Note" : "Add Detective Note"} 
              className="note-form-card"
            >
              <form onSubmit={handleSubmit} className="new-note-form">
                <div className="form-group">
                  <label className="form-label">Classification Category</label>
                  <select
                    className="form-select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Deduction">Deduction</option>
                    <option value="Interrogation">Interrogation</option>
                    <option value="Forensics">Forensics</option>
                    <option value="Clue Link">Clue Link</option>
                    <option value="Suspicious Lead">Suspicious Lead</option>
                    <option value="Timeline Log">Timeline Log</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Note Title / Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Alibi discrepancy..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Field Observations</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Enter detective findings, suspect contradictions, or theories..."
                    rows={5}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                  />
                </div>

                <div className="form-action-row">
                  <Button type="submit">
                    {editingNoteId ? "UPDATE NOTE" : "SAVE TO CASE LOG"}
                  </Button>
                  {editingNoteId && (
                    <Button variant="default" onClick={handleCancelEdit}>
                      CANCEL
                    </Button>
                  )}
                </div>
              </form>
            </Card>

            <div className="notes-journal-tip">
              <span className="tip-title">DETECTIVE TIP:</span>
              <p>
                Events from the <strong>Crime Timeline</strong> can be saved to your journal with one click for easy cross-referencing during deduction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default Notes;
