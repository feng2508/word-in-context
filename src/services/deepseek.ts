import { getDeepSeekApiKey } from "./settings";

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-flash";

export type DeepSeekConnectionResult =
  | "connected"
  | "invalid-key"
  | "connection-failed";

export async function requestDeepSeekCompletion(
  prompt: string,
): Promise<string> {
  const apiKey = await getDeepSeekApiKey();

  if (!apiKey) {
    throw new Error("No DeepSeek API key is configured.");
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

export async function testDeepSeekConnection(): Promise<DeepSeekConnectionResult> {
  try {
    await requestDeepSeekCompletion("Reply with exactly: Connected.");
    return "connected";
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("401") || message.includes("403")) {
      return "invalid-key";
    }

    return "connection-failed";
  }
}