from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/parse")
async def parse_command(request: Request):
    data = await request.json()
    text = data.get("text", "").lower()

    task_keywords = ["task", "to do", "list", "add to list", "add to do"]
    reminder_keywords = ["remind", "reminder", "remember to", "set reminder"]
    note_keywords = ["note", "save note", "jot down", "write down", "take note", "notes"]

    intent = "unknown"
    entities = {}

    if any(keyword in text for keyword in reminder_keywords):
        intent = "add_reminder"
        entities["reminder_text"] = text

    elif any(keyword in text for keyword in task_keywords):
        intent = "add_task"
        entities["task_description"] = text

    elif any(keyword in text for keyword in note_keywords):
        intent = "add_note"
        entities["note_content"] = text

    return JSONResponse(content={"intent": intent, "entities": entities})

@app.get("/")
async def root():
    return {"message": "EchoMind AI Insight Engine is live!"}

