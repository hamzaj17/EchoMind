import express from 'express';
import { createReminder, getReminders, deleteReminder } from '../controllers/reminderController.js';

const router = express.Router();

router.post('/reminders', createReminder);
router.get('/reminders', getReminders);
router.delete('/reminders/:id', deleteReminder);

export default router;
