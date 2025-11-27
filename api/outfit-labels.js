// /api/outfit-labels.js

const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2";
// If this model is gated / paid on your account, try e.g.
// const MODEL_ID = "tiiuae/falcon-7b-instruct";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("Missing HUGGINGFACE_API_KEY");
      return res
        .status(500)
        .json({ error: "Missing Hugging Face API key" });
    }

    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const { pieces } = body;

    if (!Array.isArray(pieces)) {
      return res.status(400).json({ error: "Invalid payload" });
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

    const prompt = [
      "You are a fashion stylist.",
      "Based on this list of clothing pieces, give a short, catchy outfit name and one-sentence description.",
      'Return valid JSON with fields "name" and "description".',
      `Pieces: ${piecesText}`,
    ].join(" ");

    const hfResponse = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 80,
            temperature: 0.7,
          },
        }),
      }
    );

    const raw = await hfResponse.text();

    if (!hfResponse.ok) {
      // This will now come back to your frontend so we can see the real cause
      console.error("HF error", hfResponse.status, raw);
      return res.status(500).json({
        error: "HF API failed",
        status: hfResponse.status,
        details: raw,
      });
    }

    let hfData;
    try {
      hfData = JSON.parse(raw);
    } catch {
      hfData = raw;
    }

    const generatedText =
      (Array.isArray(hfData)
        ? hfData[0]?.generated_text
        : hfData?.generated_text) || "";

    const trimmed = String(generatedText || "").trim();

    let name = "AI styled outfit";
    let description = trimmed;

    // Try to parse JSON if the model followed instructions
    try {
      const parsedGenerated = JSON.parse(trimmed);
      if (parsedGenerated && typeof parsedGenerated === "object") {
        if (parsedGenerated.name) name = parsedGenerated.name;
        if (parsedGenerated.description) description = parsedGenerated.description;
      }
    } catch {
      // If it's not JSON, we just keep the raw text as description
    }

    return res.status(200).json({ name, description });
  } catch (error) {
    console.error("Failed to generate outfit label", error);
    return res.status(500).json({ error: "Failed to generate outfit label" });
  }
}
