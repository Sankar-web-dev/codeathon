export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Food Rescue Network"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        max_tokens: 200,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `
You are an assistant for the Food Rescue Network - a platform focused on reducing hunger and food waste.
You help users understand:
- How to donate food
- How the hunger risk visualization works
- How households are prioritized for food distribution
- General questions about food security

Give short, clear, direct answers.
Maximum 3-4 sentences.
No long explanations.
Be concise, helpful, and professional.
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    return Response.json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ error: "AI Error" }, { status: 500 });
  }
}
