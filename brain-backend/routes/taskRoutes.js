import express from 'express';
import { createTask, getTasks, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

router.post('/tasks', createTask);
router.get('/tasks', getTasks);
router.delete('/tasks/:id', deleteTask);

export default router;
