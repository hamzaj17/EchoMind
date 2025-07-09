const parseCommand = require('../services/aiInsightService');
const db = require('../services/dbService');

async function handleCommand(req, res) {
    const { text } = req.body;
    const parsed = parseCommand(text);

    let result;

    if (parsed.intent === "add_task") {
        result = await db.addTask(parsed.data);
    } else if (parsed.intent === "add_note") {
        result = await db.addNote(parsed.data);
    } else {
        result = { message: "Command not recognized." };
    }

    res.json({
        status: "success",
        intent: parsed.intent,
        result: result
    });
}

module.exports = { handleCommand };
