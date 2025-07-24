const backendBaseURL = "https://honest-analysis-production.up.railway.app/api";

// Utility
function createItemElement(text, id, type) {
    const item = document.createElement('div');
    item.className = 'item';

    const span = document.createElement('span');
    span.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.style.background = 'transparent';
    deleteBtn.style.border = 'none';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '1.2rem';
    deleteBtn.title = 'Delete';

    deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await fetch(`${backendBaseURL}/${type}/${id}`, { method: 'DELETE' });
                fetchDashboardData();
                if (type === 'tasks') fetchTasks();
                if (type === 'notes') fetchNotes();
                if (type === 'reminders') fetchReminders();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    });

    item.appendChild(span);
    item.appendChild(deleteBtn);

    return item;
}

// Navigation logic
document.getElementById('dashboardNav').addEventListener('click', () => showSection('dashboard'));
document.getElementById('tasksNav').addEventListener('click', () => showSection('tasks'));
document.getElementById('notesNav').addEventListener('click', () => showSection('notes'));
document.getElementById('remindersNav').addEventListener('click', () => showSection('reminders'));

function showSection(section) {
    document.getElementById('dashboardSection').style.display = (section === 'dashboard') ? 'block' : 'none';
    document.getElementById('tasksSection').style.display = (section === 'tasks') ? 'block' : 'none';
    document.getElementById('notesSection').style.display = (section === 'notes') ? 'block' : 'none';
    document.getElementById('remindersSection').style.display = (section === 'reminders') ? 'block' : 'none';

    if (section === 'tasks') fetchTasks();
    if (section === 'notes') fetchNotes();
    if (section === 'reminders') fetchReminders();
}

// Fetch Dashboard (recent 3)
async function fetchDashboardData() {
    try {
        const tasksRes = await fetch(`${backendBaseURL}/tasks`);
        const tasks = await tasksRes.json();
        const dashboardTasks = document.getElementById('dashboardTasks');
        dashboardTasks.innerHTML = '';
        tasks.slice(-3).reverse().forEach(task => {
            dashboardTasks.appendChild(createItemElement(task.description, task.id, 'tasks'));
        });

        const notesRes = await fetch(`${backendBaseURL}/notes`);
        const notes = await notesRes.json();
        const dashboardNotes = document.getElementById('dashboardNotes');
        dashboardNotes.innerHTML = '';
        notes.slice(-3).reverse().forEach(note => {
            dashboardNotes.appendChild(createItemElement(note.content, note.id, 'notes'));
        });

        const remindersRes = await fetch(`${backendBaseURL}/reminders`);
        const reminders = await remindersRes.json();
        const dashboardReminders = document.getElementById('dashboardReminders');
        dashboardReminders.innerHTML = '';
        reminders.slice(-3).reverse().forEach(reminder => {
            dashboardReminders.appendChild(createItemElement(reminder.content, reminder.id, 'reminders'));
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}

// Load More
document.getElementById('loadMoreTasksBtn').addEventListener('click', () => showSection('tasks'));
document.getElementById('loadMoreNotesBtn').addEventListener('click', () => showSection('notes'));
document.getElementById('loadMoreRemindersBtn').addEventListener('click', () => showSection('reminders'));

// Full Fetches
async function fetchTasks() {
    try {
        const res = await fetch(`${backendBaseURL}/tasks`);
        const tasks = await res.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        tasks.reverse().forEach(task => {
            taskList.appendChild(createItemElement(task.description, task.id, 'tasks'));
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

async function fetchNotes() {
    try {
        const res = await fetch(`${backendBaseURL}/notes`);
        const notes = await res.json();
        const noteList = document.getElementById('noteList');
        noteList.innerHTML = '';
        notes.reverse().forEach(note => {
            noteList.appendChild(createItemElement(note.content, note.id, 'notes'));
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

async function fetchReminders() {
    try {
        const res = await fetch(`${backendBaseURL}/reminders`);
        const reminders = await res.json();
        const reminderList = document.getElementById('reminderList');
        reminderList.innerHTML = '';
        reminders.reverse().forEach(reminder => {
            reminderList.appendChild(createItemElement(reminder.content, reminder.id, 'reminders'));
        });
    } catch (error) {
        console.error('Error fetching reminders:', error);
    }
}

// Add Task
document.getElementById('addTaskBtn').addEventListener('click', async () => {
    const input = document.getElementById('taskInput');
    const description = input.value.trim();
    if (!description) return;
    try {
        await fetch(`${backendBaseURL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        });
        input.value = '';
        fetchTasks();
        fetchDashboardData();
    } catch (error) {
        console.error('Error adding task:', error);
    }
});

// Add Note
document.getElementById('addNoteBtn').addEventListener('click', async () => {
    const input = document.getElementById('noteInput');
    const content = input.value.trim();
    if (!content) return;
    try {
        await fetch(`${backendBaseURL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        input.value = '';
        fetchNotes();
        fetchDashboardData();
    } catch (error) {
        console.error('Error adding note:', error);
    }
});

// Add Reminder
document.getElementById('addReminderBtn').addEventListener('click', async () => {
    const input = document.getElementById('reminderInput');
    const content = input.value.trim();
    if (!content) return;
    try {
        await fetch(`${backendBaseURL}/reminders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        input.value = '';
        fetchReminders();
        fetchDashboardData();
    } catch (error) {
        console.error('Error adding reminder:', error);
    }
});

// Voice Assistant Button State
const voiceBtn = document.getElementById('voiceAssistantBtn');

function startListening() {
    voiceBtn.textContent = '🎙️ EchoMind Listening... Say "stop" to exit.';
    voiceBtn.classList.add('listening');
}

function stopListening() {
    voiceBtn.textContent = '🚀 Activate EchoMind';
    voiceBtn.classList.remove('listening');
}

// Voice Assistant
voiceBtn.addEventListener('click', () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support Speech Recognition. Please use Chrome or Edge.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false; // re-trigger manually

    const listenAndSend = () => {
        recognition.start();
    };

    recognition.onstart = () => {
        startListening();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
    };

    recognition.onend = () => {
        stopListening();
    };

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Voice Input:', transcript);

        if (transcript.includes('stop') || transcript.includes('exit') || transcript.includes('quit')) {
            alert("EchoMind has stopped listening.");
            stopListening();
            return;
        }

        try {
            const response = await fetch(`${backendBaseURL}/command`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: transcript })
            });

            const data = await response.json();

            if (!data || !data.data) {
                alert(data.message || "Sorry, I didn't understand. Please repeat.");
            } else {
                alert(data.message || "Command executed successfully.");
                fetchDashboardData();
                fetchTasks();
                fetchNotes();
                fetchReminders();
            }
        } catch (error) {
            console.error('Error sending voice command:', error);
            alert('Error executing command.');
        }

        setTimeout(() => {
            listenAndSend();
        }, 500);
    };

    listenAndSend();
});

// Initial Load
fetchDashboardData();
