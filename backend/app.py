import os
from openai import OpenAI
import dotenv
import chromadb
from typing import List, TypedDict
import json
import chromadb.utils.embedding_functions as embedding_functions
from flask import Flask, request


class Message(TypedDict):
    sender: str
    message: str


class Conversation(TypedDict):
    conversation: List[Message]


with open("example_chats/conversation1_financial_trouble_abroad.json") as f:
    conversation1: Conversation = json.load(f)
with open("example_chats/conversation2_fake_medical_emergency.json") as f:
    conversation2: Conversation = json.load(f)
with open("example_chats/conversation3_surprise_travel_plan.json") as f:
    conversation3: Conversation = json.load(f)
with open("example_chats/conversation4_inheritance_claim.json") as f:
    conversation4: Conversation = json.load(f)
with open("example_chats/conversation5_military_deployment_romance.json") as f:
    conversation5: Conversation = json.load(f)


dotenv.load_dotenv()

openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
chroma = chromadb.Client()

conversations: List[Conversation] = [
    conversation1,
    conversation2,
    conversation3,
    conversation4,
]

openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key=os.getenv("OPENAI_API_KEY"), model_name="text-embedding-3-small"
)


def get_embedding(message: str) -> List[float]:
    return (
        openai.embeddings.create(input=[message], model="text-embedding-3-small")
        .data[0]
        .embedding
    )


def create_collection(conversation: Conversation):
    col = chroma.create_collection(
        name=id(conversation),
        embedding_function=openai_ef,
    )
    for m in conversation["conversation"]:
        col.add(
            documents=m["message"],
            metadatas=[{"sender": m["sender"]}],
            ids=[m["sender"]],
        )


for idx in range(len(conversations)):
    # create index
    col = chroma.create_collection(
        name=f"conversation_{idx+1}",
        embedding_function=openai_ef,
    )
    for m in conversations[idx]["conversation"]:
        col.add(
            documents=m["message"],
            metadatas=[{"sender": m["sender"]}],
            ids=[m["sender"]],
        )


def insert_document():
    data = request.get_json()
    create_collection(data)
    return "ok"


app = Flask(__name__)

app.route("/", methods=["POST"])

if __name__ == "__main__":
    app.run(debug=True)
