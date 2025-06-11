import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN: str = os.getenv("BOT_TOKEN", "dummy-token")
API_BASE: str = os.getenv("API_BASE", "http://localhost:8080")
