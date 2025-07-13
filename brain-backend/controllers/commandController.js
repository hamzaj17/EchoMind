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

        // Store in Command table for global history
        const newCommand = await prisma.command.create({
            data: {
                action: parsedCommand.action,
                type: parsedCommand.type,
                content: parsedCommand.content
            }
        });

        // Route to specific table
        let result = null;
        if (parsedCommand.type === 'task') {
            result = await prisma.task.create({
                data: { description: parsedCommand.content }
            });
        } else if (parsedCommand.type === 'note') {
            result = await prisma.note.create({
                data: { content: parsedCommand.content }
            });
        } else if (parsedCommand.type === 'reminder') {
            result = await prisma.reminder.create({
                data: { content: parsedCommand.content }
            });
        }

        res.json({
            message: `Command processed and stored in '${parsedCommand.type}'`,
            data: {
                command: newCommand,
                routedData: result || "No specific type matched; stored only in Command table."
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error storing command", error: error.message });
    }
};
