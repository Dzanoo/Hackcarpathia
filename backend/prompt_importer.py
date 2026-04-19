import os


def load_sys_prompt() -> str:
    SYS_PROMPT_FILE = "system_prompt.txt"
    if os.path.isfile(SYS_PROMPT_FILE):
        with open(SYS_PROMPT_FILE, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        print("No system prompt found: " + SYS_PROMPT_FILE)
        exit(1)