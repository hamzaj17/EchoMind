const parseCommand = require('../services/aiInsightService');
const db = require('../services/dbService');

async function handleCommand(req, res) {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({
            status: "error",
            message: "No text provided"
        });
    }

    const parsed = parseCommand(text);
    let result;
    let successful = false;

    try {
        switch (parsed.intent) {
            case "add_task":
                result = await db.addTask(
                    parsed.data.description,
                    parsed.data.listName,
                    parsed.data.category,
                    parsed.data.priority
                );
                successful = true;
                break;

            case "get_tasks":
                result = await db.getTasks(parsed.data.listName);
                successful = true;
                break;

            case "complete_task":
                // This would need more sophisticated parsing to identify which task
                result = { message: "Task completion requires task identification. Try: 'Show my tasks' first." };
                break;

            case "add_note":
                result = await db.addNote(
                    parsed.data.content,
                    parsed.data.title
                );
                successful = true;
                break;

            case "get_notes":
                result = await db.getNotes();
                successful = true;
                break;

            case "create_list":
                result = await db.createList(parsed.data.name);
                successful = true;
                break;

            case "get_lists":
                result = await db.getLists();
                successful = true;
                break;

            case "help":
                result = {
                    message: "I can help you with:",
                    commands: [
                        "Add [item] to my list - adds item to your default list",
                        "Add [item] to shopping list - adds to shopping list",
                        "Show my tasks - displays your tasks",
                        "Take a note [content] - saves a note",
                        "Show my notes - displays your notes",
                        "Create [name] list - creates a new list",
                        "Show my lists - displays all lists"
                    ]
                };
                successful = true;
                break;

            default:
                result = { 
                    message: "Command not recognized. Say 'help' to see available commands.",
                    suggestions: [
                        "Try: 'Add buying milk to my list'",
                        "Try: 'Show my tasks'",
                        "Try: 'Take a note remember to call mom'"
                    ]
                };
        }

        // Log the voice command for analytics
        await db.logVoiceCommand(text, parsed.intent, successful, JSON.stringify(result));

        // Format response based on intent
        let responseMessage = "";
        if (parsed.intent === "add_task" && successful) {
            responseMessage = `Added "${result.description}" to your ${result.list.name} list.`;
        } else if (parsed.intent === "add_note" && successful) {
            responseMessage = `Note saved: "${result.content}"`;
        } else if (parsed.intent === "get_tasks" && successful) {
            const taskCount = result.length;
            if (taskCount === 0) {
                responseMessage = "You have no pending tasks.";
            } else {
                const taskList = result.map(task => `- ${task.description}`).join('\n');
                responseMessage = `You have ${taskCount} task${taskCount > 1 ? 's' : ''}:\n${taskList}`;
            }
        } else if (parsed.intent === "get_lists" && successful) {
            const listNames = result.map(list => `${list.name} (${list.tasks.length} tasks)`).join('\n');
            responseMessage = `Your lists:\n${listNames}`;
        } else if (parsed.intent === "create_list" && successful) {
            responseMessage = `Created "${result.name}" list.`;
        }

        res.json({
            status: "success",
            intent: parsed.intent,
            result: result,
            message: responseMessage || result.message,
            successful: successful
        });

    } catch (error) {
        console.error('Error handling command:', error);
        
        // Log the failed command
        await db.logVoiceCommand(text, parsed.intent, false, error.message);

        res.status(500).json({
            status: "error",
            intent: parsed.intent,
            message: "Sorry, I encountered an error processing your command.",
            error: error.message
        });
    }
}

module.exports = { handleCommand };
