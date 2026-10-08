type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-flash";

export async function requestDeepSeekCompletion(
  prompt: string,
): Promise<string> {
  const apiKey = import.meta.env.WXT_DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("Missing WXT_DEEPSEEK_API_KEY.");
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      thinking: { type: "disabled" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as DeepSeekResponse;
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("DeepSeek returned an empty response.");
  }

  return content;
}
