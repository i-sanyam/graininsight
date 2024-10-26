import os
from dotenv import load_dotenv

class AppConfig:
    def __init__(self):
        load_dotenv()  # Load environment variables from .env file
        self.FLASK_ENV = os.getenv('FLASK_ENV')
        self.FE_PORT = os.getenv('FE_PORT')
        self.CLERK_BEARER_TOKEN_SECRET = os.getenv('CLERK_BEARER_TOKEN_SECRET')
        self.PORT = os.getenv('PORT', 5000)

    def log_config(self):
        print(f"FLASK_ENV: {self.FLASK_ENV}")
        print(f"FE_PORT: {self.FE_PORT}")
        print(f"CLERK_BEARER_TOKEN_SECRET: {self.CLERK_BEARER_TOKEN_SECRET}")
        print(f"PORT: {self.PORT}")

# Create a global config instance
config = AppConfig()