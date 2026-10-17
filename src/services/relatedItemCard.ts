import type { SelectionData } from "../hooks/useSelectionData";
import type { WordCard } from "../types/wordCard";
import { requestDeepSeekCompletion } from "./deepseek";

export async function requestRelatedItemCard(
  item: string,
  selection: SelectionData,
): Promise<WordCard> {
  const content = await requestDeepSeekCompletion(`Create a minimal German learning card for this related item. It may be a separable verb, a verb-preposition construction, or a fixed expression. Return JSON only with "category", "dictionaryDefinition", and optional "notes" (at most two short notes).

Related item: ${JSON.stringify(item)}
Sentence: ${JSON.stringify(selection.sentence ?? "")}`);
  const value: unknown = JSON.parse(content.trim().replace(/^```json\s*/i, "").replace(/\s*```$/, ""));
  if (typeof value !== "object" || value === null) {
    throw new Error("AI returned an invalid related item card.");
  }
  const card = value as Record<string, unknown>;
  if (typeof card.category !== "string" || typeof card.dictionaryDefinition !== "string") {
    throw new Error("AI returned an invalid related item card.");
  }
  return {
    category: card.category.trim(),
    dictionaryDefinition: card.dictionaryDefinition.trim(),
    ...(Array.isArray(card.notes) ? { notes: card.notes.filter((note): note is string => typeof note === "string").map((note) => note.trim()).filter(Boolean).slice(0, 2) } : {}),
  };
}
