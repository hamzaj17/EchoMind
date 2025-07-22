import prisma from '../prisma/prismaClient.js';

export const createReminder = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Missing 'content' in request body." });
        }

        const reminder = await prisma.reminder.create({
            data: { content }
        });

        res.status(201).json({ message: "Reminder created successfully.", data: reminder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating reminder.", error: error.message });
    }
};

export const getReminders = async (req, res) => {
    try {
        const reminders = await prisma.reminder.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(reminders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching reminders.", error: error.message });
    }
};