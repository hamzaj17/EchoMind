import prisma from '../prisma.js';

// Add a task
async function addTask(description) {
    return await prisma.tasks.create({
        data: {
            description: description,
        },
    });
}

// Add a note
async function addNote(content) {
    return await prisma.notes.create({
        data: {
            content: content,
        },
    });
}

export { addTask, addNote };
