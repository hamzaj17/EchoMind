import React, { useState, useEffect } from 'react';
import { FaStickyNote, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import './Notes.css';

function Notes() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://honest-analysis-production.up.railway.app/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (noteContent.trim() === '') return;

    try {
      const response = await axios.post('https://honest-analysis-production.up.railway.app/api/notes', {
        content: noteContent.trim()
      });
      setNotes([response.data.data, ...notes]);
      setNoteContent('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      await axios.delete(`https://honest-analysis-production.up.railway.app/api/notes/${noteToDelete}`);
      setNotes(notes.filter(note => note.id !== noteToDelete));
    } catch (error) {
      console.error('Failed to delete note:', error);
    } finally {
      setNoteToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="notes-container">
      <div className="notes-header">
        <div className="notes-title">
          <div className="note-icon"><FaStickyNote /></div>
          <h1>Notes</h1>
        </div>
        <button 
          className="add-note-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FaPlus /> Add note
        </button>
      </div>

      {showAddForm && (
        <div className="add-note-form-container">
          <form onSubmit={handleAddNote} className="add-note-form">
            <textarea
              placeholder="Write your note content here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="note-content-input"
              rows="4"
              required
            />
            <div className="form-buttons">
              <button type="submit" className="save-btn">Save Note</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setNoteContent('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="notes-list">
        {loading ? (
          <p>Loading notes...</p>
        ) : notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} className="note-item">
              <div className="note-content">
                <div className="note-details">
                  <div className="note-title-text">Note #{note.id}</div>
                  <div className="note-date">{formatDate(note.createdAt)}</div>
                  <div className="note-preview">
                    {note.content.length > 100 
                      ? `${note.content.substring(0, 100)}...` 
                      : note.content}
                  </div>
                </div>
              </div>
              <button 
                className="delete-btn"
                onClick={() => setNoteToDelete(note.id)}
                title="Delete note"
              >
                <FaTrash />
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No notes yet. Click "Add note" to create your first note!</p>
          </div>
        )}
      </div>

      {/* Themed confirmation modal */}
      {noteToDelete !== null && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h2>Delete Note?</h2>
            <p>This action cannot be undone. Are you sure?</p>
            <div className="confirm-buttons">
              <button onClick={confirmDeleteNote} className="confirm-yes">Yes, Delete</button>
              <button onClick={() => setNoteToDelete(null)} className="confirm-no">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
