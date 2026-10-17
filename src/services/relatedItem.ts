import type { SelectionData } from "../hooks/useSelectionData";
import { requestDeepSeekCompletion } from "./deepseek";

export async function requestRelatedItem(
  selection: SelectionData,
): Promise<string | null> {
  const content = await requestDeepSeekCompletion(`Identify whether the exact text marked by <selected> and </selected> is part of one useful larger German lexical unit in this sentence. Return JSON only: {"relatedItem":"dictionary form"} or {"relatedItem":null}.

Example: In "Er stellt die Lampe auf den Tisch auf.", selecting "Tisch" returns null; selecting the final "auf" may return "aufstellen".

Sentence: ${JSON.stringify(selection.markedSentence ?? selection.sentence ?? "")}`);
  const value: unknown = JSON.parse(content.trim().replace(/^```json\s*/i, "").replace(/\s*```$/, ""));

  if (typeof value !== "object" || value === null) {
    throw new Error("AI returned an invalid related item.");
  }

  const item = (value as Record<string, unknown>).relatedItem;
  if (item === null) {
    return null;
  }
  if (typeof item === "string" && item.trim()) {
    return item.trim();
  }
  throw new Error("AI returned an invalid related item.");
}
