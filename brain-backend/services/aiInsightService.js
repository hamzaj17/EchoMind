module.exports = function parseCommand(text) {
    text = text.toLowerCase();

    if (text.includes("add") && text.includes("list")) {
        return {
            intent: "add_task",
            data: text.replace("add", "").replace("to my list", "").trim()
        };
    } else if (text.includes("note")) {
        return {
            intent: "add_note",
            data: text.replace("note", "").trim()
        };
    } else {
        return {
            intent: "unknown",
            data: text
        };
    }
};
