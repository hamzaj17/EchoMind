function parseCommand(text) {
    text = text.toLowerCase();

    if (text.includes("add") && text.includes("list")) {
        return {
            intent: "add_task",
            entities: {
                task: text.replace("add", "").replace("to my list", "").trim()
            }
        };
    } else if (text.includes("note")) {
        return {
            intent: "add_note",
            entities: {
                note: text.replace("note", "").trim()
            }
        };
    } else {
        return {
            intent: "unknown",
            entities: {
                raw: text
            }
        };
    }
}

export default { parseCommand };
