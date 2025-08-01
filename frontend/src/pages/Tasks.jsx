import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash, FaPlus } from 'react-icons/fa';
import './Tasks.css';
import axios from 'axios';

const API_URL = 'https://honest-analysis-production.up.railway.app/api/tasks';

function Tasks() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(API_URL);
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTasks(sorted);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (taskText.trim() === '') {
      alert("Please enter a task description");
      return;
    }

    try {
      const res = await axios.post(API_URL, { description: taskText.trim() });
      const createdTask = res.data.data;
      if (!createdTask || !createdTask.id) throw new Error("Invalid response");

      setTasks([createdTask, ...tasks]);
      setTaskText('');
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add task:", err.response?.data || err.message);
      alert("Failed to add task. Check console for details.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  
const toggleTaskCompletion = async (taskId, currentState) => {
  // Immediately update UI (optimistic update)
  setTasks(prevTasks =>
    prevTasks.map(task =>
      task.id === taskId ? { ...task, completed: !currentState } : task
    )
  );

  try {
    // Then make API call
    await axios.put(`${API_URL}/${taskId}`, { completed: !currentState });
  } catch (err) {
    console.error("Failed to toggle task completion:", err);

    // Revert UI if API fails
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: currentState } : task
      )
    );

    alert("Failed to update task. Please try again.");
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
    <div className="tasks-container">
      <div className="tasks-header">
        <div className="tasks-title">
          <div className="check-icon">
            <FaCheck />
          </div>
          <h1>Tasks</h1>
        </div>
        <button 
          className="add-task-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FaPlus /> Add task
        </button>
      </div>

      {showAddForm && (
        <div className="add-task-form-container">
          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              placeholder="Enter task description"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="task-input"
              autoFocus
            />
            <div className="form-buttons">
              <button type="submit" className="save-btn">Save</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setTaskText('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tasks-list">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Click "Add task" to create your first task!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
              <div className="task-content">
                <div
                  className={`task-checkbox ${task.completed ? "checked" : ""}`}
                  onClick={() => toggleTaskCompletion(task.id, task.completed)}
                >
                   {task.completed && <FaCheck />}
                </div>   
                
                <div className="task-details">
                  <div className={`task-text ${task.completed ? "strikethrough" : ""}`}>
                    {task.description}
                    </div>

                  <div className="task-date">{formatDate(task.createdAt)}</div>
                </div>
              </div>
              <button 
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
                title="Delete task"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;
