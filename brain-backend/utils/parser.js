// brain-backend/utils/parser.js

export default function parseCommand(text) {
    if (typeof text !== 'string' || text.trim() === '') {
        throw new Error("Invalid input: 'text' must be a non-empty string.");
    }

    const lower = text.toLowerCase().trim();

    let type = '';
    if (lower.includes('remind')) {
        type = 'reminder';
    } else if (lower.includes('note')) {
        type = 'note';
    } else if (lower.includes('task') || lower.includes('todo') || lower.includes('to do')) {
        type = 'task';
    } else {
        type = 'unknown';
    }

    const action = 'add'; // default action
    const content = lower; // store raw text for now

    return { action, type, content };
}
