import prisma from '../prisma/prismaClient.js';

// Create Reminder
export const createReminder = async (req, res) => {
    try {
        const { content, datetime } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Missing 'content' in request body." });
        }

        const reminder = await prisma.reminder.create({
            data: {
                content,
                datetime: datetime ? new Date(datetime) : null  // Ensure proper Date object
            }
        });

        res.status(201).json({ message: "Reminder created successfully.", data: reminder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating reminder.", error: error.message });
    }
};

// Get All Reminders (Include datetime explicitly)
export const getReminders = async (req, res) => {
    try {
        const reminders = await prisma.reminder.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                content: true,
                datetime: true,       // ✅ Ensure this is sent to frontend
                createdAt: true
            }
        });

        res.json(reminders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching reminders.", error: error.message });
    }
};

// Delete Reminder
export const deleteReminder = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.reminder.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Reminder deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting reminder.", error: error.message });
    }
};
