import OpenAI from "openai";

export const reminderModel = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  return new OpenAI({ apiKey });
}
