export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("Missing HUGGINGFACE_API_KEY");
      return res.status(500).json({ error: "Missing Hugging Face API key" });
    }

    const parsedBody =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { pieces } = parsedBody || {};

    if (!Array.isArray(pieces)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const piecesText = pieces
      .map((p, i) => {
        return `${p.slot || "piece"}: ${p.brand || "Unknown"} ${
          p.title || p.name || "Unknown item"
        } (${p.colour || p.color || "unspecified"})`;
      })
      .join("; ");

    const prompt = `
      You are a fashion stylist.
      Based on these clothes, generate JSON:
      { "name": "...", "description": "..." }
      Pieces: ${piecesText}
    `;

    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 80, temperature: 0.7 },
        }),
      }
    );

    if (!hfResponse.ok) {
      return res.status(500).json({ error: "HF API failed" });
    }

    const data = await hfResponse.json();
    const text =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text.trim()
        : "";

    let result = {
      name: "AI styled outfit",
      description: text,
    };

    try {
      const parsed = JSON.parse(text);
      if (parsed?.name) result.name = parsed.name;
      if (parsed?.description) result.description = parsed.description;
    } catch {}

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
