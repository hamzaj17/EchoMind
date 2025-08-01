import React, { useEffect, useState } from 'react';
import { FaClock, FaTrash, FaPlus } from 'react-icons/fa';
import './Reminders.css';

function Reminders() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [reminderTitle, setReminderTitle] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [reminders, setReminders] = useState([]);

    const fetchReminders = async () => {
        try {
            const response = await fetch('https://honest-analysis-production.up.railway.app/api/reminders');
            const data = await response.json();
            setReminders(data);
        } catch (error) {
            console.error('Failed to fetch reminders:', error);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    const handleAddReminder = async (e) => {
        e.preventDefault();
        if (reminderTitle.trim() === '' || !reminderDate || !reminderTime) return;

        const fullDateTime = `${reminderDate} ${reminderTime}`;
        try {
            const response = await fetch('https://honest-analysis-production.up.railway.app/api/reminders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: `${reminderTitle} at ${fullDateTime}` })
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

    const deleteReminder = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this reminder?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://honest-analysis-production.up.railway.app/api/reminders/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await fetchReminders();
            } else {
                console.error('Failed to delete reminder');
            }
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    };

    const parseDateTimeFromContent = (content) => {
        const parts = content.split(' at ');
        if (parts.length < 2) return { title: content, date: '', time: '' };

        const [title, datetime] = parts;
        const [date, time] = datetime.split(' ');
        return { title, date, time };
    };

    const isPast = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return false;
        const dt = new Date(`${dateStr}T${timeStr}`);
        return dt < new Date();
    };

    const formattedReminders = reminders.map((reminder) => {
        const { title, date, time } = parseDateTimeFromContent(reminder.content);
        return {
            id: reminder.id,
            title,
            date,
            time,
            isPast: isPast(date, time)
        };
    }).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

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
                {formattedReminders.map(reminder => (
                    <div
                        key={reminder.id}
                        className={`reminder-item ${reminder.isPast ? 'past' : ''}`}
                    >
                        <div className="reminder-content">
                            <div className="reminder-details">
                                <div className="reminder-title-text">{reminder.title}</div>
                                <div className="reminder-datetime">{`${reminder.time}`}</div>
                            </div>
                        </div>
                        <button
                            className="delete-btn"
                            onClick={() => deleteReminder(reminder.id)}
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
            </div>
        </div>
    );
}

export default Reminders;
