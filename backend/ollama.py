"""
ollama.py — komunikacja z lokalnym Ollama LLM
"""

import json
import logging

import httpx
from fastapi import HTTPException

logger = logging.getLogger(__name__)

OLLAMA_URL = "http://172.16.16.8:11434/api/chat"
OLLAMA_MODEL = "SpeakLeash/bielik-11b-v3.0-instruct:Q4_K_M"   # zmień na model który masz: mistral, phi3, gemma2
OLLAMA_TIMEOUT = 120.0


async def ask_ollama(messages: list) -> str:
    """
    Wysyła historię wiadomości do Ollamy.
    Zwraca surową odpowiedź tekstową modelu.
    """
    async with httpx.AsyncClient(timeout=OLLAMA_TIMEOUT) as client:
        try:
            resp = await client.post(OLLAMA_URL, json={
                "model": OLLAMA_MODEL,
                "messages": messages,
                "stream": False,
                "format": "json",
                "options": {"temperature": 0.1, "num_ctx": 8192},
            })
            resp.raise_for_status()
            return resp.json()["message"]["content"]
        except httpx.ConnectError:
            raise HTTPException(503, "Ollama niedostępna. Uruchom: ollama serve")
        except httpx.TimeoutException:
            raise HTTPException(504, "Ollama przekroczyła czas. Spróbuj ponownie.")
        except Exception as e:
            logger.error(f"Błąd Ollama: {e}")
            raise HTTPException(500, f"Błąd komunikacji z AI: {e}")

# async def ask_ollama(messages: list) -> str:
#     return '''{
#       "document_type": "umowa_zlecenie",
#       "summary": "To jest umowa zlecenie na pracę kelnera w restauracji na 3 miesiące.",
#       "key_points": [
#         "Wynagrodzenie: 25 zł/h",
#         "Czas trwania: 3 miesiące",
#         "Kara za niestawienie się: 200 zł"
#       ],
#       "risk_flags": [
#         {
#           "fragment": "Kara umowna za niestawienie się w pracy: 200 zł",
#           "explanation": "Pracodawca nie może pobierać kar pieniężnych spoza KP",
#           "level": "nielegalne",
#           "legal_basis": "Art. 87 Kodeksu Pracy",
#           "recommendation": "Nie podpisuj tej umowy bez usunięcia tej klauzuli"
#         }
#       ],
#       "overall_risk": "wysokie"
#     }'''

def parse_llm_json(raw: str) -> dict:
    """
    Parsuje JSON z odpowiedzi LLM.
    Usuwa ewentualne bloki markdown (```json ... ```) jeśli model je doda.
    """
    clean = raw.strip()
    if clean.startswith("```"):
        parts = clean.split("```")
        clean = parts[1].lstrip("json").strip() if len(parts) > 1 else clean
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        logger.error(f"Nieprawidłowy JSON od LLM: {clean[:300]}")
        raise HTTPException(500, "AI zwróciło nieprawidłową odpowiedź. Spróbuj ponownie.")


async def check_ollama_health() -> dict:
    """Sprawdza czy Ollama działa i jakie modele są dostępne."""
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            resp = await client.get("http://localhost:11434/api/tags")
            models = [m["name"] for m in resp.json().get("models", [])]
            return {"status": "ok", "models": models}
        except Exception as e:
            return {"status": "error", "message": str(e)}