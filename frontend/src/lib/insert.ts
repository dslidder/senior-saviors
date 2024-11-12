"use server";

async function insertDocument(conversation: {
  conversation: { sender: string; message: string }[];
}) {
  const url = `http://localhost:5000/`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conversation),
    });

    if (!response.ok) {
      throw new Error("Failed to insert document");
    }
  } catch (error) {
    console.error("Failed to insert document:", error);
  }
}

export default insertDocument;
