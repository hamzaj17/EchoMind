import prisma from '../prisma/prismaClient.js';
import axios from 'axios';

export const handleCommand = async (req, res) => {
    try {
        const { command, message, text } = req.body;
        const receivedText = command || message || text;

        if (!receivedText) {
            return res.status(400).json({ message: "Missing 'command', 'message', or 'text' in request body." });
        }

        // Send to AI Insight Engine
        const aiResponse = await axios.post('http://127.0.0.1:8000/parse', { text: receivedText });
        const { intent, entities } = aiResponse.data;

        let result;

        if (intent === "add_task") {
            result = await prisma.task.create({
                data: {
                    description: entities.task_description
                }
            });
        } else if (intent === "add_reminder") {
            result = await prisma.reminder.create({
                data: {
                    content: entities.reminder_text
                }
            });
        } else if (intent === "add_note") {
            result = await prisma.note.create({
                data: {
                    content: entities.note_content
                }
            });
        } else {
            return res.status(200).json({
                message: "Sorry, I couldn't understand. Please repeat.",
                data: null
            });
        }

        res.json({ message: "Command processed and stored successfully.", data: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error storing command.", error: error.message });
    }
};
