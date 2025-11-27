// api/outfit-labels.js

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
// Pick a small, router-supported chat model:
const HF_MODEL = "Qwen/Qwen2.5-0.5B-Instruct";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return res.status(500).json({ error: "Missing Hugging Face API key" });
    }

    // Vercel usually parses JSON already, but be defensive
    const body =
      typeof req.body === "string" && req.body
        ? JSON.parse(req.body)
        : req.body || {};

    const { pieces } = body;

    if (!Array.isArray(pieces)) {
      return res.status(400).json({ error: "Invalid payload: pieces must be an array" });
    }

    const piecesText = pieces
      .map((piece, idx) => {
        const slot = piece.slot || `piece${idx + 1}`;
        const title = piece.title || piece.name || "Unknown item";
        const brand = piece.brand || "Unknown brand";
        const colour = piece.colour || piece.color || "unspecified colour";
        return `${slot}: ${brand} ${title} (${colour})`;
      })
      .join("; ");

    const systemPrompt =
      'You are a fashion stylist. You must respond ONLY with valid JSON, in this exact format: {"name": "...", "description": "..." }.';

    const userPrompt = `Based on this list of clothing pieces, give a short, catchy outfit name and one-sentence description.\nPieces: ${piecesText}`;

    const hfResponse = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 80,
        temperature: 0.7,
      }),
    });

    const text = await hfResponse.text();

    if (!hfResponse.ok) {
      console.error("HF API error:", hfResponse.status, text);
      return res.status(500).json({
        error: "HF API failed",
        status: hfResponse.status,
        details: text,
      });
    }

    let answer;
    try {
      const data = JSON.parse(text);
      answer = data?.choices?.[0]?.message?.content?.trim() || "";
    } catch (e) {
      console.error("Failed to parse HF JSON:", e, text);
      answer = text.trim();
    }

    let name = "AI styled outfit";
    let description = answer;

    try {
      const parsed = JSON.parse(answer);
      if (parsed && typeof parsed === "object") {
        name = parsed.name || name;
        description = parsed.description || description;
      }
    } catch (e) {
      // If the model didn't return clean JSON, keep the raw text as description
      console.warn("Model response was not JSON, using raw text as description");
    }

    return res.status(200).json({ name, description });
  } catch (error) {
    console.error("Failed to generate outfit label:", error);
    return res.status(500).json({ error: "Failed to generate outfit label" });
  }
}
