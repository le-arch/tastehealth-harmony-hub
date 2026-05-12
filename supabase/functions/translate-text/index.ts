// Translate UI strings via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { texts, target } = await req.json();
    if (!Array.isArray(texts) || !target) {
      return new Response(JSON.stringify({ error: "texts[] and target required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (target === "en") {
      return new Response(JSON.stringify({ translations: texts }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const langName = target === "fr" ? "French" : target;
    const numbered = texts.map((t: string, i: number) => `${i + 1}. ${t}`).join("\n");

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Lovable-API-Key": LOVABLE_API_KEY,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a UI string translator. Translate each numbered English string to ${langName}.
RULES (must follow exactly):
- Keep product names (TasteHealth) untranslated.
- Preserve emojis, punctuation, capitalization style, line breaks.
- Preserve ALL placeholder tokens EXACTLY as written, including spelling, casing, underscores, and braces. Examples of tokens you must NOT translate or alter: __PH0__, __PH1__, {count}, {{name}}, %s, %d, %1$s, <0>...</0>, URLs.
- Do not add or remove placeholders. Do not insert spaces inside __PH#__ tokens.
- Return ONLY a JSON object: {"items":["translation1","translation2",...]} in the same order. No commentary.`,
          },
          { role: "user", content: numbered },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "rate_limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "credits_exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`Gateway ${resp.status}: ${body}`);
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    const items = Array.isArray(parsed.items) ? parsed.items : texts;

    return new Response(JSON.stringify({ translations: items }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
