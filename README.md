# 🚀 EchoMind: Voice Assistant that allows users to manage tasks, reminders and notes through voice commands with a Frontend Web UI

EchoMind is a **voice-driven, AI-enhanced productivity assistant** that:

✅ Voice/text command recognition (voice command recognition).

✅ Extracts structured intents/entities.

✅ Stores tasks, reminders, and notes in a **Neon PostgreSQL database** using a **Node.js backend** deployed on **Railway**.

✅ **Now includes a fully functional web-based frontend UI** to manage reminders, notes, and tasks.

✅ Fully cloud-based and globally accessible, no local server dependency.

This guide ensures **anyone can clone, run, and test EchoMind on any machine reliably**.

---

## 📂 Project Structure

<pre> 📂 EchoMind/ │ 
  
├── 📁 ai-insight-engine/ # FastAPI AI Insight Engine (deployed on Railway) │ 
  ├── main.py │ 
  ├── requirements.txt 
  │ └── ... 
  
├── 📁 brain-backend/ # Node.js + Express + Prisma + Neon DB Backend │ 
  ├── prisma/ │ 
  ├── controllers/ │ 
  ├── routes/ │ 
  ├── server.js │ 
  ├── package.json │ └── ... │ 
  
├── 📁 voice-assistant/ # Speech Input │
  └── voice_assistant.py │

├── 📁 frontend/ # React Web UI to manage notes, reminders, and tasks | 
  ├── public/ │ 
  ├── src/ │ 
  ├── index.html/ │ 
  ├── vercel.json │ 
  ├── vite.config.js │
  ├── package.json │ 
  ├── package-lock.json │
  └── ...  

🗋 README.md # Project documentation for GitHub
</pre>

---

## 🛠️ Prerequisites

✅ Git installed.

✅ Python 3.10+ installed.

✅ Node.js (v18+) and npm installed.

✅ Railway account (for FastAPI deployment).

✅ Neon account (PostgreSQL cloud DB, free).

✅ Prisma CLI (used for generating client and running migrations)

✅ Prisma Client (used in your backend code to interact with the database)

✅ For FastAPI Insight Engine (fastapi, uvicorn)

✅ For SpeechRecognition (libraries: speech_recognition, requests, pyttsx3) [optional: for speech_recognition only using backend]

✅ For frontend: React, react-icons, Vite, axios, React Router. 

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/EchoMind.git
cd EchoMind
```

---

## 2️⃣ Set Up Neon PostgreSQL Database

1. Create an account on [Neon](https://neon.tech).
2. Create a **new project** and note down the **DATABASE\_URL** connection string.
3. Ensure the database has these tables:

   * **task** (id, description, created\_at, completed)
   * **reminder** (id, content, created\_at, datetime)
   * **note** (id, content, created\_at)
4. Save your `DATABASE_URL` for the backend `.env` file.

---

## 3️⃣ Deploy AI Insight Engine (FastAPI) to Railway

### Option A: Use Existing Deployment (Recommended)

Use your deployed URL:

```
https://echomind-production-48ea.up.railway.app/parse
```

### Option B: Deploy Manually

* Create a Railway account.
* Create a new project.
* Link your GitHub repo or upload the `ai-insight-engine` folder.
* Ensure `requirements.txt` includes:

  ```
  fastapi
  uvicorn
  ```
* Add environment variable:

  ```
  PORT=8000
  ```
* Deploy and note your `/parse` endpoint URL.

---

## 4️⃣ Deploy Node.js Backend on Railway

✅ Your **Node.js backend** is deployed on Railway at:

``` bash
https://honest-analysis-production.up.railway.app
```
No local server run is needed, backend is globally accessible.

## 5️⃣ Testing the Pipeline

Use **Postman** or **curl** to test end-to-end:

```bash
curl -X POST https://honest-analysis-production.up.railway.app/api/command \
-H "Content-Type: application/json" \
-d '{"text": "remind to call Ali tomorrow"}'
```

✅ You should receive structured JSON and confirm the data is stored in your Neon DB.

---

## 6️⃣ Run CLI Voice Assistant (Optional)

Your voice_assistant.py will use your deployed backend:
<pre>
store_response = requests.post(
   "https://honest-analysis-production.up.railway.app/api/command",
   json={"text": command}
)
</pre>
This ensures your CLI now uses your **globally deployed Node.js backend on Railway** instead of localhost.

Then run your voice assistant:
<pre>
cd voice-assistant
python voice_assistant.py
</pre>

✅ Speak commands, and EchoMind will parse and store them automatically in your Neon DB via your deployed backend.


🗣️ Note: The CLI Voice Assistant now uses pyttsx3 for offline spoken confirmations when you add tasks, reminders, or notes.

✅ Works fully offline (no internet needed for speech feedback).  
✅ Provides spoken confirmations (e.g., “Task added successfully.”).  
✅ Lightweight and adjustable rate, pitch, and volume.  
✅ Helps visually confirm command success without checking the screen.

#### How to Enable:

<pre>
  Install `pyttsx3` in your environment:
pip install pyttsx3
</pre>
If on Windows:
```bash
pip install pypiwin32
```

Example usage in *voice_assistant.py*:
```bash
import pyttsx3

engine = pyttsx3.init()
engine.say("EchoMind is now listening. Please speak your command.")
engine.runAndWait()
```

You can adjust:
```bash
engine.setProperty('rate', 150)
engine.setProperty('volume', 0.8)
```

✨ With pyttsx3, EchoMind now speaks back confirmations offline, enhancing your productivity flow during CLI use.

---

## 7️⃣ Web Frontend

✅ Your **Vite + React Frontend** is deployed on Vercel at:
```bash
https://echo-mind-nu.vercel.app/
``` 

### Key Frontend Features:

✅ Front fully deployed on Vercel.

✅ View, add, and delete **Tasks**, **Reminders**, **Notes**

✅ Tasks, Reminders and Notes can be added manually.

✅ **Voice assistant** can add tasks, reminders and notes using speech recognition.

✅ On **Dashboard** there's a total count for active tasks, active reminders and total notes.

✅ In tasks list you can tick if the task is completed and it'll be removed from the total count of active tasks.

✅ **Proper date + time picker**, with local time handling in **Reminders**.

✅ After the reminder time is over, that reminder becomes **strikethrough** so we can easily differentiate between active and non-active reminders. 

✅ Time is shown in **Pakistan Standard Time (PKT)**

✅ Fully integrated with your deployed backend on Railway

✅ Minimal clean design with React hooks and modular components

---

## 🩺 Troubleshooting

✅ **FastAPI server not reachable:** Ensure Railway deployment is live and using the `/parse` endpoint.

✅ **Database errors:** Check your `DATABASE_URL` and Neon connectivity.

✅ **Port conflicts:** Change the `PORT` in your `.env` file if needed.

✅ **CORS issues:** Ensure CORS is enabled in `server.js`.

✅ **Prisma client errors:** Run `npx prisma generate` again.

---

## ✨ Features Recap

✅ Voice/text command recognition.

✅ AI-powered intent and entity extraction.

✅ Tasks, Reminders, Notes can be added manually and through speech recognition.

✅ Structured storage of tasks, reminders, and notes.

✅ Clean microservices architecture (FastAPI + Node.js + Neon).

✅ Backend fully deployed on Railway for global access.

✅ Frontend fully deployed on Vercel and connected to backend.

✅ Extendable for frontend apps, Discord bots, or mobile clients.

---

## 🤝 Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss improvements.

---

## 📧 Contact

**Hamza Bin Javed**
 [hamzabjaved04@gmail.com](mailto:hamzabjaved04@gmail.com)

 [GitHub] (https://github.com/hamzaj17)

---
For more information about this project, see the [documentation](./doc.md).

✨ *Thank you for using EchoMind! Enhance your productivity using structured, AI-powered task and reminder management with clean, modular architecture ready for your next projects.*
