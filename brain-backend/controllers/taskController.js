import prisma from '../prisma/prismaClient.js';

export const createTask = async (req, res) => {
    try {
        const { description, completed = false } = req.body;

        if (!description) {
            return res.status(400).json({ message: "Missing 'description' in request body." });
        }

        const task = await prisma.task.create({
            data: { description, completed }
        });

        res.status(201).json({ message: "Task created successfully.", data: task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating task.", error: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching tasks.", error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting task.", error: error.message });
    }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { completed },
    });

    res.json({ message: "Task updated successfully.", data: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task.", error: error.message });
  }
};

