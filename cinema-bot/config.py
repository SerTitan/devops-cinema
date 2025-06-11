import os
from dotenv import load_dotenv

load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN", "dummy-token")
EVENT_PORT = int(os.getenv("EVENT_PORT", "2000"))
