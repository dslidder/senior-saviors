import os
from openai import OpenAI
import dotenv
import chromadb
from typing import List, TypedDict
import json
import chromadb.utils.embedding_functions as embedding_functions


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
    conversation5,
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

collection1 = chroma.get_collection("conversation_1")
result = collection1.query(
    query_embeddings=[get_embedding("is this a scam?")],
    query_texts=["is this a scam?"],
    n_results=2,
)

print(result)
