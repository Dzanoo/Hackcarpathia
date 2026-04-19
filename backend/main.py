"""
main.py — FastAPI endpoints
Uruchom: uvicorn main:app --port 8000 --reload
"""
import json
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from prompt_importer import load_sys_prompt
from ocr import extract_text
from ollama import ask_ollama, check_ollama_health, parse_llm_json
from sessions import (
    append_message,
    create_session,
    delete_session,
    get_all_history,
    get_history,
    get_public_history,
    init_db,
    session_exists,
    get_db_new_id,
    get_topics,
    get_db_result
)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SYSTEM_PROMPT = load_sys_prompt()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
app = FastAPI(title="mPrzyszłość", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)


class ChatRequest(BaseModel):
    session_id: str
    message: str

haslo="tajnehaslo"
# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.get("/login")
async def login(pass_hash: str):
    if pass_hash != "tajnehaslo":
        raise HTTPException(401, "Nieprawidłowe hasło")
    return {"logged_in": True}

@app.get("/debug/prompt")
async def debug_prompt():
    from prompt_importer import load_sys_prompt
    return {"prompt": load_sys_prompt()}


@app.get("/")
async def root():
    return {
        "app": "mPrzyszłość",
        "endpoints": {
            "POST /analyze":                  "Wyślij plik (JPG/PNG/PDF) → analiza dokumentu",
            "POST /session/new":              "Utwórz sesję z historią",
            "POST /chat":                     "Pytanie follow-up w ramach sesji",
            "GET  /session/{id}/history":     "Historia rozmowy",
            "DELETE /session/{id}":           "Usuń sesję",
            "GET  /health":                   "Status Ollamy"
        }
    }

@app.get("/debug/prompt")
async def debug_prompt():
    from prompt_importer import load_sys_prompt
    return {"prompt": load_sys_prompt()}

@app.get("/health")
async def health():
    """Sprawdza czy Ollama działa i jakie modele są dostępne."""
    ollama = await check_ollama_health()
    return {"status": "ok" if ollama["status"] == "ok" else "degraded", "ollama": ollama}

@app.get("/session/new")
async def new_session():
    """Tworzy nową sesję czatu z pustą historią."""
    session_id = create_session()
    logger.info(f"Nowa sesja: {session_id}")
    return {"session_id": session_id}



@app.get("/session/{session_id}/history")
async def get_session(session_id: str):
    if not session_exists(session_id):
        raise HTTPException(404, "Sesja nie istnieje")
    return {
        "session_id": session_id,
        "exists": True,
        "messages": get_public_history(session_id),
    }


async def raw_query(session_id: str, message: str) -> dict[str, int | None]:
    # Don't re-check session here if callers already validated it
    append_message(session_id, "user", message)
    history = get_history(session_id)

    raw_response = await ask_ollama(history)
    # parse_llm_json(raw_response)

    append_message(session_id, "assistant", raw_response)
    return {"id": get_db_new_id()}


@app.post("/analyze")
async def analyze_document(
    session_id: str = Form(...),
    message: str = Form(default=""),
    file: UploadFile = File(...),
):
    try:
        if not session_exists(session_id):
            raise HTTPException(404, f"Sesja '{session_id}' nie istnieje. Utwórz przez POST /session/new")

        file_bytes = await file.read()
        if len(file_bytes) > 10 * 1024 * 1024:
            raise HTTPException(400, "Plik za duży (max 10 MB)")

        text = extract_text(file.filename, file_bytes)

        prompt = "Wiadomość Użytkownika:" + message + "\n\nDokument do analizy:\n" + text

        return await raw_query(
            session_id,
            prompt
        )

    except Exception as e:
        raise HTTPException(500, "Server Error: " + str(e))


@app.post("/query")
async def query(
    session_id: str = Form(...),
    message: str = Form(...),
) -> dict[str, int | None]:
    if not session_exists(session_id):
        raise HTTPException(404, f"Sesja '{session_id}' nie istnieje. Utwórz przez POST /session/new")

    return await raw_query(
        session_id,
        message
    )


@app.get("/history")
async def history():
    """Zwraca historię wiadomości sesji (bez system promptu)."""
    return {"history": get_topics()}

@app.get("/history/{sessoin_id}")
async def history(session_id: str):
    """Zwraca historię wiadomości sesji (bez system promptu)."""
    return {"history": get_all_history(session_id)}

@app.get("/result/{id}")
async def get_result(id: str):
    """Zwraca wynik z bazy danych."""
    result = get_db_result(id)
    if not result:
        raise HTTPException(404, "Wynik nie istnieje")
    return {"result": result}


@app.delete("/session/{session_id}")
async def remove_session(session_id: str):
    """Usuwa sesję i jej historię."""
    if not delete_session(session_id):
        raise HTTPException(404, "Sesja nie istnieje")
    return {"deleted": session_id}

@app.get("/prawa/{typ}")
async def prawa(typ: str):
    with open("data/prawa.json", 'r') as f:
        text = f.read()

        json_data = json.loads(text)
        if typ in json_data:
            return json_data[typ]
        else:
            raise HTTPException(404, "Nie ma takich praw")



# test
@app.post("/ocr-test")
async def ocr_test(file: UploadFile = File(...)):
    file_bytes = await file.read()
    text = extract_text(file.filename, file_bytes)
    return {"text": text, "length": len(text)}
