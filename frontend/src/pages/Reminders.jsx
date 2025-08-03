import React, { useEffect, useState } from 'react';
import { FaClock, FaTrash, FaPlus } from 'react-icons/fa';
import './Reminders.css';

function Reminders() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://honest-analysis-production.up.railway.app/api/reminders');
      const data = await response.json();
      setReminders(data);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();

    const handleReminderUpdate = () => {
      fetchReminders();
    };

    window.addEventListener("reminderUpdated", handleReminderUpdate);

    return () => {
      window.removeEventListener("reminderUpdated", handleReminderUpdate);
    };
  }, []);


  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (reminderTitle.trim() === '' || !reminderDate || !reminderTime) return;

    const fullDateTime = `${reminderDate} ${reminderTime}`; // ✅ Fixed: proper string formatting

    try {
      const response = await fetch('https://honest-analysis-production.up.railway.app/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: reminderTitle, // ✅ Send human-readable version
          datetime: fullDateTime // ✅ Send ISO-style datetime to backend
        })
      });

      if (response.ok) {
        await fetchReminders();
        setReminderTitle('');
        setReminderDate('');
        setReminderTime('');
        setShowAddForm(false);
      } else {
        console.error('Failed to create reminder');
      }
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  const confirmDeleteReminder = (id) => setDeleteId(id);

  const handleDeleteConfirmed = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`https://honest-analysis-production.up.railway.app/api/reminders/${deleteId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchReminders();
      } else {
        console.error('Failed to delete reminder');
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
    } finally {
      setDeleteId(null);
    }
  };

  const cancelDelete = () => setDeleteId(null);

  // const parseDateTimeFromContent = (content) => {
  //   const parts = content.split(' at ');
  //   if (parts.length < 2) return { title: content, date: '', time: '' };
  //   const [title, datetime] = parts;
  //   const [date, time] = datetime.split(' ');
  //   return { title, date, time };
  // };

  const isPast = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return false;
    const dt = new Date(`${dateStr}T${timeStr}`);
    return dt < new Date();
  };

const formattedReminders = reminders.map((reminder) => {
  // let title = reminder.content;
  // let date = '';
  // let time = '';

  // if (reminder.datetime) {
    const dt = new Date(reminder.datetime);
    const date = dt.toISOString().slice(0,10); // "YYYY-MM-DD"
    const time = dt.toTimeString().slice(0, 5);   // "HH:MM"
  // }

  return {
    id: reminder.id,
    title,
    date,
    time,
    isPast: isPast(date, time),
  };
}).sort((a, b) => {
  // Use real datetime fields for sorting
  const dateA = new Date(a.date + 'T' + a.time);
  const dateB = new Date(b.date + 'T' + b.time);
  return dateA - dateB;
});



  return (
    <div className="reminders-container">
      <div className="reminders-header">
        <div className="reminders-title">
          <div className="clock-icon"><FaClock /></div>
          <h1>Reminders</h1>
        </div>
        <button className="add-reminder-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <FaPlus /> Add reminder
        </button>
      </div>

      {showAddForm && (
        <div className="add-reminder-form-container">
          <form onSubmit={handleAddReminder} className="add-reminder-form">
            <input
              type="text"
              placeholder="Enter reminder title"
              value={reminderTitle}
              onChange={(e) => setReminderTitle(e.target.value)}
              className="reminder-title-input"
              autoFocus
            />
            <div className="datetime-inputs">
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="reminder-date-input"
                min={new Date().toISOString().split('T')[0]}
              />
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="reminder-time-input"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="save-btn">Save Reminder</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setReminderTitle('');
                  setReminderDate('');
                  setReminderTime('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="reminders-list">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="reminder-item skeleton">
                <div className="reminder-content">
                  <div className="reminder-details">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-time"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {formattedReminders.map(reminder => (
              <div
                key={reminder.id}
                className={`reminder-item ${reminder.isPast ? 'past' : ''}`}
              >
                <div className="reminder-content">
                  <div className="reminder-details">
                    <div className={`reminder-title-text ${reminder.isPast ? 'strikethrough' : ''}`}>
                      {reminder.title}
                    </div>
                    <div className="reminder-datetime">{`${reminder.date} ${reminder.time}`}</div>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => confirmDeleteReminder(reminder.id)}
                  title="Delete reminder"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {formattedReminders.length === 0 && (
              <div className="empty-state">
                <p>No reminders yet. Click "Add reminder" to create your first reminder!</p>
              </div>
            )}
          </>
        )}
      </div>

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Reminder?</h3>
            <p>This action cannot be undone. Are you sure?</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteConfirmed} className="confirm-btn">Yes, delete</button>
              <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reminders;
