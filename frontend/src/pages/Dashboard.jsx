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

        // FIXED: Proper reminder counting logic - only future reminders are active
        const now = new Date();
        const activeReminders = remindersRes.data.filter((reminder) => {
          if (!reminder.datetime) return false;

          let reminderDate;
          
          // Handle different datetime formats from your database
          if (reminder.datetime.includes('T')) {
            // ISO format: "2025-01-15T18:25:00"
            reminderDate = new Date(reminder.datetime);
          } else {
            // Space format: "2025-01-15 18:25"
            reminderDate = new Date(reminder.datetime.replace(' ', 'T'));
          }

          // Only count reminders that are clearly in the future
          // Add a small buffer (1 minute) to avoid counting reminders that just passed
          const bufferTime = 60 * 1000; // 1 minute in milliseconds
          const currentTimeWithBuffer = new Date(now.getTime() + bufferTime);
          
          return reminderDate > currentTimeWithBuffer;
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