// pages/api/outfit-labels.js

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_MODEL = "meta-llama/Meta-Llama-3.1-8B-Instruct"; // adjust to a model that works in your HF Playground
const HF_PROVIDER = "hf-inference"; // use HF's own inference provider

export default async function handler(req, res) {
  try {
    // 1. Method guard
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    // 2. Check token
    const apiKey = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing Hugging Face API key" });
    }

    // 3. Parse body
    const parsedBody =
      typeof req.body === "string" && req.body
        ? JSON.parse(req.body)
        : req.body || {};

    const { pieces } = parsedBody;

    if (!Array.isArray(pieces) || pieces.length === 0) {
      return res.status(400).json({ error: "Invalid payload: pieces must be a non-empty array" });
    }

    // 4. Turn pieces into readable text
    const piecesText = pieces
      .map((piece, idx) => {
        const slot = piece.slot || `piece${idx + 1}`;
        const title = piece.title || piece.name || "Unknown item";
        const brand = piece.brand || "Unknown brand";
        const colour = piece.colour || piece.color || "unspecified colour";
        return `- ${slot}: ${brand} ${title} (${colour})`;
      })
      .join("\n");

    // 5. Prompt for the model (ask for JSON)
    const userPrompt = [
      "You are a fashion stylist.",
      "Given these clothing pieces, create a short, catchy outfit name and one-sentence description.",
      "Return ONLY valid JSON with exactly two fields: name (string) and description (string).",
      "No extra text, no markdown.",
      "",
      "Pieces:",
      piecesText,
      "",
      "JSON:"
    ].join("\n");

    // 6. Call Hugging Face router (OpenAI-compatible)
    const hfResponse = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: HF_MODEL,
        provider: HF_PROVIDER,
        temperature: 0.7,
        max_tokens: 120,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a helpful fashion stylist AI. You MUST always respond with a single valid JSON object containing keys `name` and `description`.",
          },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!hfResponse.ok) {
      const details = await hfResponse.text();
      console.error("HF router error:", hfResponse.status, details);
      return res.status(500).json({
        error: "HF API failed",
        status: hfResponse.status,
        details,
      });
    }

    const data = await hfResponse.json();
    const rawContent = data?.choices?.[0]?.message?.content || "";

    // 7. Try to parse JSON from the model output
    let name = "AI styled outfit";
    let description = "Could not parse model response.";

    try {
      const parsed = JSON.parse(rawContent.trim());
      if (parsed && typeof parsed === "object") {
        if (typeof parsed.name === "string") name = parsed.name;
        if (typeof parsed.description === "string") description = parsed.description;
      } else {
        description = rawContent.trim();
      }
    } catch {
      // If it's not valid JSON, just return the raw text
      description = rawContent.trim() || description;
    }

    return res.status(200).json({ name, description });
  } catch (err) {
    console.error("Failed to generate outfit label:", err);
    return res.status(500).json({ error: "Failed to generate outfit label" });
  }
}
