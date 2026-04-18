"""
main.py — FastAPI endpoints
Uruchom: uvicorn main:app --port 8000 --reload
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ocr import extract_text
from ollama import ask_ollama, check_ollama_health, parse_llm_json
from prompts import SYSTEM_PROMPT, document_user_message
from sessions import (
    append_message,
    create_session,
    delete_session,
    get_history,
    get_public_history,
    init_db,
    session_exists,
    get_db_new_id,
    get_history_all,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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


# ── Endpoints ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

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


@app.get("/health")
async def health():
    """Sprawdza czy Ollama działa i jakie modele są dostępne."""
    ollama = await check_ollama_health()
    return {"status": "ok" if ollama["status"] == "ok" else "degraded", "ollama": ollama}

@app.post("/session/new")
async def new_session():
    """Tworzy nową sesję czatu z pustą historią."""
    session_id = create_session()
    logger.info(f"Nowa sesja: {session_id}")
    return {"session_id": session_id}

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

@app.post("/analyze")
async def analyze_document(
    session_id: str = Form(...),
    file: UploadFile = File(...),  # now required, no Optional
):
    if not session_exists(session_id):
        raise HTTPException(404, f"Sesja '{session_id}' nie istnieje. Utwórz przez POST /session/new")

    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(400, "Plik za duży (max 10 MB)")

    text = extract_text(file.filename, file_bytes)
    user_content = document_user_message(text)

    append_message(session_id, "user", user_content)
    history = get_history(session_id)

    raw_response = await ask_ollama(history)
    result = parse_llm_json(raw_response)

    append_message(session_id, "assistant", raw_response)
    new_id = get_db_new_id()
    return {
        "id": new_id
    }


@app.post("/chat")
async def chat(req: ChatRequest):
    """
    Pytanie follow-up w ramach istniejącej sesji.
    Np. po analizie dokumentu: "Co oznacza ten punkt?" albo "Czy mogą mi to zrobić?"
    """
    if not session_exists(req.session_id):
        raise HTTPException(404, f"Sesja '{req.session_id}' nie istnieje. Utwórz przez POST /session/new")

    append_message(req.session_id, "user", req.message)
    history = get_history(req.session_id)

    raw_response = await ask_ollama(history)
    result = parse_llm_json(raw_response)

    append_message(req.session_id, "assistant", raw_response)

    return {
        "session_id": req.session_id,
        "result": result,
        "history_length": len(get_public_history(req.session_id)),
    }


@app.get("/session/{session_id}/history")
async def history(session_id: str):
    """Zwraca historię wiadomości sesji (bez system promptu)."""
    if not session_exists(session_id):
        raise HTTPException(404, "Sesja nie istnieje")
    return {"session_id": session_id, "messages": get_public_history(session_id)}

@app.get("/history")
async def history():
    """Zwraca historię wiadomości sesji (bez system promptu)."""
    return {"history": get_history_all()}

@app.delete("/session/{session_id}")
async def remove_session(session_id: str):
    """Usuwa sesję i jej historię."""
    if not delete_session(session_id):
        raise HTTPException(404, "Sesja nie istnieje")
    return {"deleted": session_id}

@app.post("/ocr-test")
async def ocr_test(file: UploadFile = File(...)):
    file_bytes = await file.read()
    text = extract_text(file.filename, file_bytes)
    return {"text": text, "length": len(text)}