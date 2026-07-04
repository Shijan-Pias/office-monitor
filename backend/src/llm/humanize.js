// llm/humanize.js
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile"; // free/fast Groq model

// rawSummary: প্লেইন টেক্সট/JSON data যা raw device state থেকে বানানো
// instruction: কী ধরনের tone/format চাও তার নির্দেশনা
async function humanize(rawSummary, instruction) {
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a friendly office assistant bot replying in Discord. Keep replies short (2-4 sentences), warm, and conversational. Never invent data — only use what's given.",
        },
        {
          role: "user",
          content: `${instruction}\n\nRaw data:\n${rawSummary}`,
        },
      ],
      max_tokens: 200,
    });

    return completion.choices[0].message.content.trim();
  } catch (err) {
    // Groq call fail করলেও bot যেন কাজ বন্ধ না করে দেয় — raw data ফেরত দাও
    console.error("[humanize] Groq call failed, falling back to raw data:", err.message);
    return rawSummary;
  }
}

export { humanize };