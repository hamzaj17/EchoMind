module.exports = function parseCommand(text) {
    text = text.toLowerCase().trim();

    // Add task commands
    if (text.includes("add") && (text.includes("list") || text.includes("todo") || text.includes("task"))) {
        let description = text;
        let listName = "Default";
        let category = "general";
        let priority = "medium";

        // Extract the task description
        description = description
            .replace(/add/g, "")
            .replace(/to my list/g, "")
            .replace(/to the list/g, "")
            .replace(/in the list/g, "")
            .replace(/in my list/g, "")
            .replace(/to list/g, "")
            .replace(/in list/g, "")
            .replace(/task/g, "")
            .replace(/todo/g, "")
            .trim();

        // Detect specific lists
        if (text.includes("shopping") || text.includes("grocery") || text.includes("buy")) {
            listName = "Shopping";
            category = "shopping";
        } else if (text.includes("work")) {
            listName = "Work";
            category = "work";
        } else if (text.includes("personal")) {
            listName = "Personal";
            category = "personal";
        }

        // Detect priority
        if (text.includes("urgent") || text.includes("important") || text.includes("asap")) {
            priority = "high";
        } else if (text.includes("later") || text.includes("someday")) {
            priority = "low";
        }

        return {
            intent: "add_task",
            data: {
                description: description,
                listName: listName,
                category: category,
                priority: priority
            }
        };
    }

    // Complete task commands
    if ((text.includes("complete") || text.includes("done") || text.includes("finish")) && 
        (text.includes("task") || text.includes("item"))) {
        return {
            intent: "complete_task",
            data: text
        };
    }

    // Show/get tasks commands
    if ((text.includes("show") || text.includes("list") || text.includes("get")) && 
        (text.includes("tasks") || text.includes("todo") || text.includes("items"))) {
        
        let listName = null;
        if (text.includes("shopping")) listName = "Shopping";
        else if (text.includes("work")) listName = "Work";
        else if (text.includes("personal")) listName = "Personal";

        return {
            intent: "get_tasks",
            data: { listName: listName }
        };
    }

    // Note commands
    if (text.includes("note") || text.includes("remember") || text.includes("remind me")) {
        let content = text
            .replace(/take a note/g, "")
            .replace(/add a note/g, "")
            .replace(/note/g, "")
            .replace(/remember/g, "")
            .replace(/remind me/g, "")
            .trim();

        return {
            intent: "add_note",
            data: {
                content: content,
                title: null
            }
        };
    }

    // Show notes commands
    if ((text.includes("show") || text.includes("get")) && text.includes("notes")) {
        return {
            intent: "get_notes",
            data: {}
        };
    }

    // Create list commands
    if (text.includes("create") && text.includes("list")) {
        let listName = text
            .replace(/create/g, "")
            .replace(/list/g, "")
            .replace(/new/g, "")
            .trim();

        return {
            intent: "create_list",
            data: { name: listName }
        };
    }

    // Show lists commands
    if ((text.includes("show") || text.includes("get")) && text.includes("lists")) {
        return {
            intent: "get_lists",
            data: {}
        };
    }

    // Help command
    if (text.includes("help") || text.includes("what can you do")) {
        return {
            intent: "help",
            data: {}
        };
    }

    // Default unknown command
    return {
        intent: "unknown",
        data: text
    };
};
