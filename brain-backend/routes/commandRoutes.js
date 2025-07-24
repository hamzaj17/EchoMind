import express from 'express';
import { handleCommand } from '../controllers/commandController.js';

const router = express.Router();

router.post('/command', handleCommand);

export default router;
