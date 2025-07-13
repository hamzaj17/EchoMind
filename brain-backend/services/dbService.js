const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Task operations
async function addTask(description, listName = 'Default', category = 'general', priority = 'medium') {
    try {
        // Find or create the list
        let list = await prisma.list.findUnique({
            where: { name: listName }
        });

        if (!list) {
            list = await prisma.list.create({
                data: { name: listName }
            });
        }

        // Create the task
        const task = await prisma.task.create({
            data: {
                description,
                category,
                priority,
                listId: list.id
            },
            include: {
                list: true
            }
        });

        return task;
    } catch (error) {
        console.error('Error adding task:', error);
        throw error;
    }
}

async function getTasks(listName = null, completed = null) {
    try {
        const where = {};
        
        if (listName) {
            where.list = { name: listName };
        }
        
        if (completed !== null) {
            where.completed = completed;
        }

        const tasks = await prisma.task.findMany({
            where,
            include: { list: true },
            orderBy: { createdAt: 'desc' }
        });

        return tasks;
    } catch (error) {
        console.error('Error getting tasks:', error);
        throw error;
    }
}

async function completeTask(taskId) {
    try {
        const task = await prisma.task.update({
            where: { id: taskId },
            data: { completed: true },
            include: { list: true }
        });

        return task;
    } catch (error) {
        console.error('Error completing task:', error);
        throw error;
    }
}

async function deleteTask(taskId) {
    try {
        const task = await prisma.task.delete({
            where: { id: taskId }
        });

        return task;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

// List operations
async function getLists() {
    try {
        const lists = await prisma.list.findMany({
            include: {
                tasks: {
                    where: { completed: false }
                }
            }
        });

        return lists;
    } catch (error) {
        console.error('Error getting lists:', error);
        throw error;
    }
}

async function createList(name) {
    try {
        const list = await prisma.list.create({
            data: { name }
        });

        return list;
    } catch (error) {
        console.error('Error creating list:', error);
        throw error;
    }
}

// Note operations
async function addNote(content, title = null, tags = []) {
    try {
        const note = await prisma.note.create({
            data: {
                content,
                title,
                tags: JSON.stringify(tags) // Convert array to JSON string for SQLite
            }
        });

        // Parse tags back to array for return
        return {
            ...note,
            tags: JSON.parse(note.tags)
        };
    } catch (error) {
        console.error('Error adding note:', error);
        throw error;
    }
}

async function getNotes(searchTerm = null) {
    try {
        const where = {};
        
        if (searchTerm) {
            where.OR = [
                { content: { contains: searchTerm } },
                { title: { contains: searchTerm } }
            ];
        }

        const notes = await prisma.note.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        // Parse tags from JSON strings back to arrays
        return notes.map(note => ({
            ...note,
            tags: JSON.parse(note.tags || '[]')
        }));
    } catch (error) {
        console.error('Error getting notes:', error);
        throw error;
    }
}

// Voice command logging
async function logVoiceCommand(originalText, parsedIntent, successful = false, response = null) {
    try {
        const voiceCommand = await prisma.voiceCommand.create({
            data: {
                originalText,
                parsedIntent,
                successful,
                response
            }
        });

        return voiceCommand;
    } catch (error) {
        console.error('Error logging voice command:', error);
        throw error;
    }
}

// Cleanup function
async function disconnect() {
    await prisma.$disconnect();
}

module.exports = { 
    addTask, 
    getTasks, 
    completeTask, 
    deleteTask,
    getLists,
    createList,
    addNote, 
    getNotes,
    logVoiceCommand,
    disconnect
};
