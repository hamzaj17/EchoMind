import prisma from '../prisma/prismaClient.js';

export const createNote = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Missing 'content' in request body." });
        }

        const note = await prisma.note.create({
            data: { content }
        });

        res.status(201).json({ message: "Note created successfully.", data: note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating note.", error: error.message });
    }
};

export const getNotes = async (req, res) => {
    try {
        const notes = await prisma.note.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching notes.", error: error.message });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.note.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Note deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting note.", error: error.message });
    }
};
