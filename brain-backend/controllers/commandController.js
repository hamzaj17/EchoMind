const aiInsightService = require('../services/aiInsightService');

exports.handleCommand = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        // Forward to AI Insight Engine
        const parsedCommand = await aiInsightService.parseCommand(text);

        // Here you would typically store to DB (MongoDB later)
        console.log("Parsed Command:", parsedCommand);

        return res.json({ message: 'Command received', data: parsedCommand });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
