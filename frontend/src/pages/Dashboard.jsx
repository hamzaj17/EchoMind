import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { FaCheckCircle, FaClock, FaRegStickyNote } from "react-icons/fa";

const DashboardSummary = () => {
  const [counts, setCounts] = useState({
    tasks: 0,
    reminders: 0,
    notes: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [tasksRes, remindersRes, notesRes] = await Promise.all([
          axios.get('https://honest-analysis-production.up.railway.app/api/tasks'),
          axios.get('https://honest-analysis-production.up.railway.app/api/reminders'),
          axios.get('https://honest-analysis-production.up.railway.app/api/notes'),
        ]);

        const activeTasks = tasksRes.data.filter((task) => !task.completed).length;
        const upcomingReminders = remindersRes.data.length;
        const savedNotes = notesRes.data.length;

        setCounts({
          tasks: activeTasks,
          reminders: upcomingReminders,
          notes: savedNotes,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard-summary-vertical">
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
          <span>Total reminders</span>
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
    </div>
  );
};

export default DashboardSummary;
