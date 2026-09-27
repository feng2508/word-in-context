const testPrompt = "Reply with exactly: DeepSeek connection works.";

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export async function testDeepSeekConnection() {
  const apiKey = import.meta.env.WXT_DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.error("Missing WXT_DEEPSEEK_API_KEY.");
    return;
  }

  console.log("[word-in-context] Prompt:", testPrompt);

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-flash",
      stream: false,
      thinking: { type: "disabled" },
      messages: [{ role: "user", content: testPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as DeepSeekResponse;
  console.log("[word-in-context] AI response:", data.choices?.[0]?.message?.content);
}