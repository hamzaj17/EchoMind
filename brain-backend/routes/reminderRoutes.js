import express from 'express';
import { createReminder } from '../controllers/reminderController.js';

const router = express.Router();

router.post('/reminders', createReminder);

export default router;
