import type { SelectionData } from "../hooks/useSelectionData";

export type ExplanationState =
  | { status: "loading" }
  | { status: "success"; content: string }
  | { status: "error"; message: string };

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function createPrompt(selection: SelectionData): string {
  const sentence = selection.sentence ?? "No sentence was found.";

  return `Explain "${selection.text}" in this sentence:\n${sentence}`;
}

export async function requestExplanation(
  selection: SelectionData,
): Promise<string> {
  const apiKey = import.meta.env.WXT_DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("Missing WXT_DEEPSEEK_API_KEY.");
  }

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
      messages: [{ role: "user", content: createPrompt(selection) }],
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
