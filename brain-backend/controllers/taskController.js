import prisma from '../prisma/prismaClient.js';

export const createTask = async (req, res) => {
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({ message: "Missing 'description' in request body." });
        }

        const task = await prisma.task.create({
            data: { description }
        });

        res.status(201).json({ message: "Task created successfully.", data: task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating task.", error: error.message });
    }
};
