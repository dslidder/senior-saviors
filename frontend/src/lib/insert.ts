"use server";

async function insert(conversation: {
  conversation: { sender: string; message: string }[];
}) {
  const url = `http://localhost:5000/`;
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
}
