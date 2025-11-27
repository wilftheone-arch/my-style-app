import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return res.status(500).json({ error: "Missing Hugging Face API key" });
    }

    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const { pieces } = body;

    if (!Array.isArray(pieces)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const piecesText = pieces
      .map((p) => {
        return `${p.slot || "piece"}: ${p.brand || "brand"} ${p.title || "item"} (${p.colour ||
          p.color ||
          "colour"})`;
      })
      .join("; ");

    const prompt = `
You are a professional fashion stylist.

Based on the list of clothing pieces below, create:
- a short, catchy outfit NAME
- a one-sentence DESCRIPTION

Return ONLY JSON in this shape:
{
  "name": "...",
  "description": "..."
}

Pieces: ${piecesText}
`;

    // --- HF ROUTER CLIENT ---
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: process.env.HUGGINGFACE_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "moonshotai/Kimi-K2-Thinking:novita",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const responseText = completion.choices?.[0]?.message?.content || "";

    let name = "AI styled outfit";
    let description = responseText;

    try {
      const parsed = JSON.parse(responseText);
      name = parsed.name || name;
      description = parsed.description || description;
    } catch (err) {
      // not JSON → leave defaults
    }

    return res.status(200).json({ name, description });
  } catch (err) {
    console.error("HF API failed", err);

    if (err.response) {
      const { status, data } = err.response;
      return res.status(status || 500).json({
        error: "HF API failed",
        status,
        details: JSON.stringify(data),
      });
    }

    return res.status(500).json({
      error: "HF API failed",
      details: err.message,
    });
  }
}
