import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { FaCheckCircle, FaClock, FaRegStickyNote } from "react-icons/fa";

// Skeleton loader component
const SkeletonCard = () => (
  <div className="summary-card skeleton">
    <div className="icon skeleton-icon" />
    <div className="skeleton-texts">
      <div className="skeleton-line short"></div>
      <div className="skeleton-line medium"></div>
      <div className="skeleton-line long"></div>
    </div>
  </div>
);

const DashboardSummary = () => {
  const [counts, setCounts] = useState({
    tasks: 0,
    reminders: 0,
    notes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [tasksRes, remindersRes, notesRes] = await Promise.all([
          axios.get('https://honest-analysis-production.up.railway.app/api/tasks'),
          axios.get('https://honest-analysis-production.up.railway.app/api/reminders'),
          axios.get('https://honest-analysis-production.up.railway.app/api/notes'),
        ]);

        const activeTasks = tasksRes.data.filter((task) => !task.completed).length;

        // UPDATED: Fixed reminder counting logic to match Reminders.jsx logic
        const now = new Date();
        const activeReminders = remindersRes.data.filter((reminder) => {
          if (!reminder.datetime) return false;

          let reminderDate;
          
          // Handle different datetime formats from your database
          const dtString = reminder.datetime;
          
          if (dtString.includes('T')) {
            // Parse as local time (same logic as in Reminders.jsx)
            const [datePart, timePart] = dtString.split('T');
            const timeOnly = timePart.substring(0, 5); // Get HH:MM
            reminderDate = new Date(`${datePart}T${timeOnly}:00`);
          } else {
            // Space format: "2025-01-15 18:25"
            const parts = dtString.split(' ');
            if (parts.length >= 2) {
              const datePart = parts[0];
              const timeOnly = parts[1].substring(0, 5);
              reminderDate = new Date(`${datePart}T${timeOnly}:00`);
            }
          }

          if (!reminderDate || isNaN(reminderDate.getTime())) {
            return false; // Invalid date
          }

          // CHANGED: Use the same logic as Reminders.jsx - compare by minute, not exact time
          // Get the reminder time down to the minute (ignore seconds)
          const reminderMinute = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate(), reminderDate.getHours(), reminderDate.getMinutes());
          
          // Get the current time down to the minute (ignore seconds)  
          const currentMinute = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
          
          // Only consider it past if the reminder minute is strictly before the current minute
          // If reminder minute >= current minute, it's still active
          const isActive = reminderMinute > currentMinute;
          
          console.log('Reminder:', dtString, 'Parsed as:', reminderDate, 'Current time:', now, 'Is active?', isActive);
          
          return isActive;
        }).length;

        const savedNotes = notesRes.data.length;

        setCounts({
          tasks: activeTasks,
          reminders: activeReminders,
          notes: savedNotes,
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard counts:", error);
        setLoading(false);
      }
    };

    fetchCounts();

    // ADDED: Listen for updates from other components
    const handleDataUpdate = () => {
      fetchCounts();
    };

    // Listen for custom events when data changes
    window.addEventListener("taskUpdated", handleDataUpdate);
    window.addEventListener("reminderUpdated", handleDataUpdate);
    window.addEventListener("noteUpdated", handleDataUpdate);

    return () => {
      window.removeEventListener("taskUpdated", handleDataUpdate);
      window.removeEventListener("reminderUpdated", handleDataUpdate);
      window.removeEventListener("noteUpdated", handleDataUpdate);
    };
  }, []);

  return (
    <div className="dashboard-summary-vertical">
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : (
        <>
          <div className="summary-card">
            <div className="icon"><FaCheckCircle color="green" size={20} /></div>
            <div>
              <h3>Tasks</h3>
              <p>{counts.tasks}</p>
              <span>Active tasks</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="icon"><FaClock color="blue" size={20} /></div>
            <div>
              <h3>Reminders</h3>
              <p>{counts.reminders}</p>
              <span>Active reminders</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="icon"><FaRegStickyNote color="purple" size={20} /></div>
            <div>
              <h3>Notes</h3>
              <p>{counts.notes}</p>
              <span>Saved notes</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardSummary;