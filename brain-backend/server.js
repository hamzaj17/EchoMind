require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const commandRoutes = require('./routes/commands');
const db = require('./services/dbService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/command', commandRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'EchoMind Backend is running',
        version: '2.0.0',
        features: ['Voice Commands', 'Task Management', 'Notes', 'Lists'],
        endpoints: {
            'POST /command': 'Process voice commands',
            'GET /': 'Health check'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 EchoMind Backend is running on http://localhost:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await db.disconnect();
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await db.disconnect();
    server.close(() => {
        console.log('Process terminated');
    });
});
