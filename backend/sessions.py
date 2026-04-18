"""
sessions.py — SQLite storage for chat sessions
"""

import json
import sqlite3
import uuid
import os

from prompt_importer import load_sys_prompt

DB_PATH = os.path.join(os.path.dirname(__file__), "sessions.db")
SYSTEM_PROMPT = load_sys_prompt()


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create tables if they don't exist. Call once on startup."""
    with _get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES sessions(session_id)
            )
        """)


def create_session() -> str:
    session_id = str(uuid.uuid4())
    with _get_conn() as conn:
        conn.execute("INSERT INTO sessions (session_id) VALUES (?)", (session_id,))
    return session_id


def session_exists(session_id: str) -> bool:
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT 1 FROM sessions WHERE session_id = ?", (session_id,)
        ).fetchone()
    return row is not None

def get_db_new_id() -> int | None:
    """Returns the last inserted message ID."""
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT id FROM messages ORDER BY id DESC LIMIT 1"
        ).fetchone()
    return row["id"] if row else None

def get_db_result(id: int) -> dict | None:
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT content FROM messages WHERE id = ? AND role = 'assistant'",
            (id,)
        ).fetchone()
    return json.loads(row["content"]) if row else None

def get_history(session_id: str) -> list:
    """Returns full history with system prompt prepended in memory — not stored in DB."""
    with _get_conn() as conn:
        rows = conn.execute(
            "SELECT role, content FROM messages WHERE session_id = ? ORDER BY id",
            (session_id,)
        ).fetchall()
    messages = [{"role": r["role"], "content": r["content"]} for r in rows]
    return [{"role": "system", "content": SYSTEM_PROMPT}] + messages


def get_history_all() -> list:
    """Returns full history with system prompt prepended in memory — not stored in DB."""
    with _get_conn() as conn:
        rows = conn.execute(
            "SELECT role, content FROM messages WHERE role = 'assistant' ORDER BY id",
        ).fetchall()
    messages = [{"role": r["role"], "content": r["content"]} for r in rows]
    return [{"role": "system", "content": SYSTEM_PROMPT}] + messages

def get_public_history(session_id: str) -> list:
    """Returns history without system prompt — for the user."""
    with _get_conn() as conn:
        rows = conn.execute(
            "SELECT role, content, created_at FROM messages WHERE session_id = ? AND role != 'system' ORDER BY id",
            (session_id,)
        ).fetchall()
    return [{"role": r["role"], "content": r["content"], "created_at": r["created_at"]} for r in rows]


def append_message(session_id: str, role: str, content: str) -> None:
    """Appends a message to the session."""
    with _get_conn() as conn:
        conn.execute(
            "INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)",
            (session_id, role, content)
        )


def delete_session(session_id: str) -> bool:
    """Deletes session and all its messages. Returns True if it existed."""
    with _get_conn() as conn:
        cursor = conn.execute(
            "DELETE FROM sessions WHERE session_id = ?", (session_id,)
        )
        conn.execute(
            "DELETE FROM messages WHERE session_id = ?", (session_id,)
        )
    return cursor.rowcount > 0