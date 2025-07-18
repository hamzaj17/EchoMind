# 🚀 EchoMind: AI Insight Engine + Smart Task, Reminder, Note Manager

EchoMind is a **voice-driven, AI-enhanced productivity assistant** that:

✅ Parses spoken/text commands using an **AI Insight Engine (FastAPI)**.

✅ Extracts structured intents/entities.

✅ Stores tasks, reminders, and notes in a **Neon PostgreSQL database** using a **Node.js backend** deployed on **Railway**.

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
└── README.md # Project documentation for GitHub </pre>

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

✅ For SpeechRecognition (libraries: speech_recognition, requests)

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

   * **task** (id, description, created\_at)
   * **reminder** (id, content, created\_at)
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

<pre>
https://honest-analysis-production.up.railway.app
</pre>
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

## 6️⃣ Run CLI Voice Assistant

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

✅ Structured storage of tasks, reminders, and notes.

✅ Clean microservices architecture (FastAPI + Node.js + Neon).

✅ Fully deployed on Railway for global access

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

✨ *Thank you for using EchoMind! Enhance your productivity using structured, AI-powered task and reminder management with clean, modular architecture ready for your next projects.*
