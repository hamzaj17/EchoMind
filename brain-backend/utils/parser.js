export default function parseCommand(text) {
    if (typeof text !== 'string' || text.trim() === '') {
        throw new Error("Invalid input: 'text' must be a non-empty string.");
    }

    const lower = text.toLowerCase().trim();

    let action = '';
    if (lower.startsWith('add')) {
        action = 'add';
    } else if (lower.startsWith('remove')) {
        action = 'remove';
    } else {
        action = 'unknown';
    }

    let type = '';
    if (lower.includes('task')) {
        type = 'task';
    } else if (lower.includes('note')) {
        type = 'note';
    } else if (lower.includes('reminder')) {
        type = 'reminder';
    } else {
        type = 'unknown';
    }

    const content = lower; // entire lower text as content

    return { action, type, content };
}
