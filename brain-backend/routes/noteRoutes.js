import express from 'express';
import { createNote } from '../controllers/noteController.js';

const router = express.Router();

router.post('/notes', createNote);

export default router;
