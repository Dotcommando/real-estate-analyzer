import os
from dotenv import load_dotenv
from uvicorn import run

load_dotenv()

host = os.getenv("ANALYSIS_SERVICE_HOST")
port = int(os.getenv("ANALYSIS_SERVICE_PORT"))
mode = os.getenv("MODE")

reload = mode == "dev"

run("main:app", host=host, port=port, reload=False)
