<h1>📄 Project Documentation – EchoMind</h1>

<h2>Project Overview</h2>

EchoMind is a AI-powered voice assistant web application that allows users to manage tasks, reminders, and notes through voice commands. It includes:

    🗃️ Brain Backend (Node.js + Prisma + PostgreSQL)

    🖥️ React Frontend (Vite + React)

---

<h2>🗂️ Folder Structure</h2>

<pre>
  📂 EchoMind/
│
├── 📁 ai-insight-engine/      # FastAPI-based AI Insight Engine
├── 📁 brain-backend/          # Node.js backend with Express and Prisma
├── 📁 voice-assistant/        # Python-based Speech Recognition
├── 📁 frontend/               # React Vite-based Web UI
│
🗋 README.md                   # GitHub documentation
🗋 doc.md                # Project technical documentation (this file)
</pre>
---

<h2>Project Flow</h2>

<h3>(1)Voice Command(Frontend):</h3>

User clicks the microphone button in VoiceButton.jsx.

It uses webkitSpeechRecognition to capture the spoken input (e.g., "Add a task to finish the report").

The recognized text is immediately processed on the frontend.

<h3>(2)Command Processing & Routing (Frontend + Backend):</h3>

If the command includes the word "reminder", it opens a modal in the frontend to let the user pick a date and time, then sends that to the /api/reminders backend route.

For other commands (e.g., notes or tasks), the command text is sent to the backend via POST /api/command.

The backend then uses its logic (with optional classification help) to parse and store the data using Prisma.

<h3>(3)Speech Feedback (Frontend):</h3>

Once the backend responds, the Web Speech API’s SpeechSynthesisUtterance is used to speak back to the user (e.g., "Note added successfully").

<h3>(4)Loop Listening (Frontend):</h3>

The assistant can continue listening in a loop if the user does not say “stop” or “exit”.

---

<h2>Required Technologies and Installation</h2>
<h3>Frontend (React + Vite)</h3>

 **Installed Manually:**

        * React
        * Vite
        * react-router-dom
        * axios
        * react-icons (for icons in frontend)

  **Pre-installed (via npm create vite@latest):**

        * Basic Vite+React setup

  **Additional:**

        * Voice interaction with SpeechSynthesisUtterance(Web Speech API)

<h3>Backend (Node.js + Prisma)</h3>

    * Express
    * Prisma ORM
    * PostgreSQL (Neon DB)

<h3>AI Insight Engine(optional)</h3>

    * FastAPI
    * Deployed on Railway

<h3>Voice Assistant(optional)</h3>

    * Python 3.10+
    * speech_recognition
    * pyttsx3
    * requests

---

<h2>📁 Detailed File Responsibilities</h2>
<h3>ai-insight-engine/ (optional)</h3>

    main.py: FastAPI app that receives a transcription and returns intent.

    requirements.txt: Lists all Python dependencies.

<h3>brain-backend/</h3>

    server.js: Entry point for the Node.js Express server.

  **routes/:**
  
   <pre>
    commandRoutes.js: Routes for command handling 
    noteRoutes.js: Defines Notes API endpoints 
    reminderRoutes.js: Defines Reminder API endpoints
    taskRoutes.js: Defines Task API endpoints</pre>  

  **controllers/:**
   <pre>
    commandController.js: Handles classified commands
    noteController.js: Notes logic to handle routes 
    reminderController.js: Reminder logic to handle routes
    taskController.js: Task logic to handle routes</pre> 

  **services/:** 
    <pre>Interaction with database and AI insight engine.</pre>

  **utils/** 
  
     parser.js: Parses commands into structured JSON.

  **schema.prisma:** 
    <pre>Defines Prisma schema for tasks, notes, and reminders.</pre>

<h3>voice-assistant/ (optional)</h3>

    voice_assistant.py: Captures voice using microphone, converts to text using SpeechRecognition, and sends to backend.

<h3>frontend/</h3>

    public/: Contains logo assets and static files.

    vite.config.js: Configuration for Vite.

    vercel.json: Deployment config for Vercel.

🔹 **components/**

    Navbar.jsx / Navbar.css: Top navigation bar.

    VoiceButton.jsx / VoiceButton.css: Button to trigger voice assistant.

🔹 **pages/**

    Dashboard.jsx: Summarizes all tasks, notes and reminders.

    Home.jsx / Home.css: Landing page.

    Tasks.jsx / Tasks.css: View, complete, and delete tasks.

    Notes.jsx / Notes.css: View and manage notes.

    Reminders.jsx / Reminders.css: View and manage time-based reminders.

🔹 **App.jsx / App.css**

    Routing logic using react-router-dom.

    Displays Navbar, VoiceButton, and routes.

🔹 **main.jsx**

    ReactDOM root configuration.

---

<h2>System Requirements:</h2>

✅ Frontend: Works in any modern browser (no GPU/ML dependency).

✅ AI Engine: Can run on small CPU instance (no GPU needed).

✅ Voice Assistant: Requires microphone input (Use browsers like Google Chrome, Micrososft Edge because they support speech recognition).

✅ Database: NeonDB (PostgreSQL – cloud hosted).

✅ RAM Required: Minimum 1 GB (for testing)

✅ Deployment Targets: Railway + Vercel (free tiers are sufficient)

---

<h2>Summary</h2>

✅ **All features implemented:** Task, Note, and Reminder creation via voice and UI.

✅ Voice understanding AI.

✅ **Database-backed** with Prisma + NeonDB.

✅ **Clean UI** with React and custom CSS.

✅ **Deployed frontend & backend** with Vercel and Railway
