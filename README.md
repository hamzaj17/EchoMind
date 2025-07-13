# 🎙️ EchoMind AI Voice Assistant

A powerful AI voice assistant with seamless task management, note-taking, and Prisma Cloud database integration.

## ✨ Features

- **Voice Commands**: Natural language processing for intuitive interaction
- **Task Management**: Add, view, and organize tasks with smart categorization
- **Multiple Lists**: Shopping, work, personal, and custom lists
- **Notes**: Quick voice-to-text note taking
- **Cloud Database**: Prisma Cloud integration with local SQLite fallback
- **Real-time Processing**: Instant voice command recognition and response

## 🗂️ Project Structure

```
├── brain-backend/          # Node.js backend with Prisma
│   ├── prisma/             # Database schema and migrations
│   ├── services/           # Business logic (AI, database)
│   ├── controllers/        # Request handlers
│   ├── routes/             # API endpoints
│   └── server.js           # Express server
├── voice-assistant/        # Python voice processing
│   └── voice_assistant.py  # Speech recognition & API calls
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd brain-backend
npm install
npm run db:push
npm start
```

### 2. Voice Assistant

```bash
cd voice-assistant
pip install speechrecognition requests pyaudio
python voice_assistant.py
```

### 3. Start Talking!

Say any of these commands:
- "Add buying milk to my list"
- "Add call client to work list"
- "Show my tasks"
- "Take a note remember doctor appointment"
- "Show my notes"
- "Help"

## 🎯 Voice Commands

### Task Management
- **Add tasks**: "Add [item] to my list"
- **Add to specific lists**: "Add [item] to shopping list"
- **View tasks**: "Show my tasks" / "Show shopping tasks"
- **Create lists**: "Create work list"
- **View lists**: "Show my lists"

### Notes
- **Add notes**: "Take a note [content]"
- **Add with keywords**: "Remember [content]"
- **View notes**: "Show my notes"

### Smart Features
- **Auto-categorization**: "buying milk" → Shopping list
- **Priority detection**: "urgent" → High priority
- **Context awareness**: Recognizes work, personal, shopping contexts

## 🗄️ Database Setup

### Local Development (Current)
- Uses SQLite for immediate testing
- Data stored in `brain-backend/dev.db`
- No setup required - works out of the box

### Prisma Cloud (Production)
1. Follow `brain-backend/PRISMA_CLOUD_SETUP.md`
2. Get your Prisma Cloud connection string
3. Update `DATABASE_URL` in `.env`
4. Run `npm run db:push`

## 🛠️ Development

### Backend Scripts
```bash
npm run dev          # Development with auto-reload
npm run start        # Production start
npm run db:studio    # Open database GUI
npm run db:push      # Push schema changes
npm run db:migrate   # Create migrations
```

### API Endpoints

- `GET /` - Backend status and info
- `GET /health` - Health check
- `POST /command` - Process voice commands

Example API call:
```bash
curl -X POST http://localhost:5000/command \
  -H "Content-Type: application/json" \
  -d '{"text": "Add buying milk to my list"}'
```

## 📊 Database Schema

- **Tasks**: Description, priority, category, completion status
- **Lists**: Named collections of tasks
- **Notes**: Free-form text with optional titles and tags
- **Voice Commands**: Command logging for analytics

## 🔧 Configuration

### Environment Variables (.env)
```env
DATABASE_URL="file:./dev.db"  # Local SQLite
# DATABASE_URL="postgresql://..." # Prisma Cloud
PORT=5000
NODE_ENV=development
```

## 🚦 Current Status

✅ **Working Features:**
- Voice recognition and processing
- Task creation and retrieval
- Note taking and storage
- Multiple list management
- Smart command parsing
- Database operations
- API endpoints

🔄 **Ready for:**
- Prisma Cloud migration
- Production deployment
- Advanced voice commands
- Mobile app integration

## 🎨 Customization

### Adding New Commands
1. Update `services/aiInsightService.js` for intent recognition
2. Add handler in `controllers/commandController.js`
3. Implement database operations in `services/dbService.js`

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `npm run db:generate`
3. Run `npm run db:push` (dev) or `npm run db:migrate` (prod)

## 🐛 Troubleshooting

**Voice not recognized?**
- Check microphone permissions
- Ensure Python speech recognition is installed
- Verify backend is running on port 5000

**Database errors?**
- Check `.env` file configuration
- Run `npm run db:push` to sync schema
- Use `npm run db:studio` to inspect data

**Connection issues?**
- Verify backend is running: `curl http://localhost:5000/health`
- Check firewall settings
- Ensure dependencies are installed

## 📈 Next Steps

1. **Deploy to Cloud**: Set up Prisma Cloud database
2. **Enhanced AI**: Integrate GPT for better command understanding  
3. **Mobile App**: Create React Native companion app
4. **Integrations**: Connect to Google Calendar, Slack, etc.
5. **Analytics**: Command usage dashboards

## 📝 License

MIT License - feel free to use and modify!

---

**Built with**: Node.js, Express, Prisma, SQLite/PostgreSQL, Python, SpeechRecognition

Ready to revolutionize your productivity with voice commands! 🚀