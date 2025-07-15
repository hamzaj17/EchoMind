from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/parse")
async def parse_command(request: Request):
    data = await request.json()
    text = data.get("text", "").lower().strip()

    if "task" in text or "list" in text:
        content = text.replace("add", "").replace("task", "").replace("list", "").strip()
        return {
            "intent": "add_task",
            "entities": {
                "task_description": content or text
            }
        }
    elif "reminder" in text or "remind" in text:
        content = text.replace("add", "").replace("reminder", "").replace("remind", "").strip()
        return {
            "intent": "add_reminder",
            "entities": {
                "reminder_text": content or text
            }
        }
    elif "note" in text:
        content = text.replace("add", "").replace("note", "").strip()
        return {
            "intent": "add_note",
            "entities": {
                "note_content": content or text
            }
        }
    else:
        return {
            "intent": "unknown",
            "entities": {
                "raw": text
            }
        }
