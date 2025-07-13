import express from 'express';
import cors from 'cors';
import commandRoutes from './routes/commandRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', commandRoutes);
app.use('/api', taskRoutes);
app.use('/api', noteRoutes);
app.use('/api', reminderRoutes);

app.get('/', (req, res) => {
    res.send('EchoMind Backend is running.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
