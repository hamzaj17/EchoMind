// brain-backend/controllers/commandController.js

import prisma from '../prisma/prismaClient.js';
import parseCommand from '../utils/parser.js';

export const handleCommand = async (req, res) => {
    try {
        const { command, message, text } = req.body;
        console.log("Incoming body:", req.body);

        const receivedText = command || message || text;

        if (!receivedText) {
            return res.status(400).json({ message: "Missing 'command', 'message', or 'text' in request body." });
        }

        const parsedCommand = parseCommand(receivedText);

        let savedData;

        if (parsedCommand.type === 'task') {
            savedData = await prisma.task.create({
                data: {
                    description: parsedCommand.content,
                },
            });
        } else if (parsedCommand.type === 'note') {
            savedData = await prisma.note.create({
                data: {
                    content: parsedCommand.content,
                },
            });
        } else if (parsedCommand.type === 'reminder') {
            savedData = await prisma.reminder.create({
                data: {
                    content: parsedCommand.content,
                },
            });
        } else {
            return res.status(400).json({ message: "Could not determine the type of command." });
        }

        res.json({ message: "Command received and stored successfully.", data: savedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error storing command.", error: error.message });
    }
};
