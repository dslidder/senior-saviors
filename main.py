import os
from openai import OpenAI
import dotenv

dotenv.load_dotenv()

openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
