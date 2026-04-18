def load_sys_prompt() -> str:
    SYS_PROMPT_FILE = "system_prompt.txt"
    if os.path.isfile("sys"):
        with open(SYS_PROMPT_FILE, 'r') as f:
            return f.read()
    else:
        print("No system prompt found: " + SYS_PROMPT_FILE)
        exit(1)