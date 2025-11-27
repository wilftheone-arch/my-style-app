// api/outfit-labels.js  (Vercel serverless function)

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      console.error("Missing HUGGINGFACE_API_KEY");
      return res.status(500).json({ error: "Missing Hugging Face API key" });
    }

    // Safely parse body (Vercel sometimes gives string, sometimes object)
    const parsedBody =
      typeof req.body === "string" && req.body
        ? JSON.parse(req.body)
        : req.body || {};

    const { pieces } = parsedBody;

    if (!Array.isArray(pieces)) {
      return res.status(400).json({ error: "Invalid payload: pieces must be an array" });
    }

    // Turn the pieces into a compact text description
    const piecesText = pieces
      .map((piece, idx) => {
        const slot = piece.slot || `piece${idx + 1}`;
        const title = piece.title || piece.name || "Unknown item";
        const brand = piece.brand || "Unknown brand";
        const colour = piece.colour || piece.color || "unspecified colour";
        return `${slot}: ${brand} ${title} (${colour})`;
      })
      .join("; ");

    // We'll use the OpenAI-compatible chat endpoint on router.huggingface.co
    const systemPrompt =
      "You are a fashion stylist. " +
      "Given some clothing pieces, you must return ONLY valid JSON " +
      'with two fields: "name" and "description". ' +
      'Do not include any extra text before or after the JSON.';

    const userPrompt = `Pieces: ${piecesText}`;

    const hfResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 120,
      }),
    });

    const hfJson = await hfResponse.json();

    if (!hfResponse.ok) {
      console.error("HF error:", hfResponse.status, hfJson);
      return res.status(500).json({
        error: "HF API failed",
        status: hfResponse.status,
        details: JSON.stringify(hfJson),
      });
    }

    const content =
      hfJson?.choices?.[0]?.message?.content?.trim() || "";

    let name = "AI styled outfit";
    let description = content;

    // Try to parse the model output as JSON { name, description }
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        if (typeof parsed.name === "string") name = parsed.name;
        if (typeof parsed.description === "string") description = parsed.description;
      }
    } catch (err) {
      // If it’s not valid JSON, keep the raw text as description
      console.warn("Could not parse model output as JSON, using raw text.");
    }

    return res.status(200).json({ name, description });
  } catch (error) {
    console.error("Failed to generate outfit label", error);
    return res.status(500).json({ error: "Failed to generate outfit label" });
  }
}
