"""
sessions.py — przechowywanie i zarządzanie sesjami czatu w pamięci
"""

import uuid
from prompts import SYSTEM_PROMPT

# Słownik sesji: { session_id: [ {role, content}, ... ] }
_sessions: dict[str, list] = {}


def create_session() -> str:
    """Tworzy nową sesję z system promptem. Zwraca session_id."""
    session_id = str(uuid.uuid4())
    _sessions[session_id] = [{"role": "system", "content": SYSTEM_PROMPT}]
    return session_id


def get_history(session_id: str) -> list | None:
    """Zwraca historię wiadomości sesji lub None jeśli nie istnieje."""
    return _sessions.get(session_id)


def append_message(session_id: str, role: str, content: str) -> None:
    """Dodaje wiadomość do historii sesji."""
    _sessions[session_id].append({"role": role, "content": content})


def delete_session(session_id: str) -> bool:
    """Usuwa sesję. Zwraca True jeśli istniała."""
    if session_id in _sessions:
        del _sessions[session_id]
        return True
    return False


def session_exists(session_id: str) -> bool:
    return session_id in _sessions


def get_public_history(session_id: str) -> list:
    """Historia bez system promptu — do zwrócenia użytkownikowi."""
    return _sessions[session_id][1:]