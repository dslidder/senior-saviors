"use server";

import OpenAI from "openai";

async function analyze(text: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({ apiKey: key });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are talking to an elderly person.",
      },
      {
        role: "system",
        content:
          "You are an expert scam detector. You will be given a conversation and your job is to determine if it is a scam or not. Supplement your answer with evidence and explanation from the conversation and links to relevant resources.",
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return completion.choices[0].message.content;
}

export default analyze;
