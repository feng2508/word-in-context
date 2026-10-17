import type { SelectionData } from "../hooks/useSelectionData";
import { requestDeepSeekCompletion } from "./deepseek";

export async function requestRelatedItem(
  selection: SelectionData,
): Promise<string | null> {
  const content = await requestDeepSeekCompletion(`Decide whether to show one related-item link for the text marked by <selected> and </selected>.

A related item is a useful larger lexical unit that includes the selected text.
It can be a separable verb, a reflexive verb, a verb-preposition construction,
a fixed collocation, an idiom, or another fixed expression. Return its
dictionary form. If there is no such item, return null.

Return JSON only: {"relatedItem":"dictionary form"} or {"relatedItem":null}.

Examples:
- "Er stellt die Lampe auf den <selected>Tisch</selected> auf." → {"relatedItem":null}
- "Er stellt die Lampe <selected>auf</selected> den Tisch auf." → {"relatedItem":null}
- "Er stellt die Lampe auf den Tisch <selected>auf</selected>." → {"relatedItem":"aufstellen"}
- "Wir warten <selected>auf</selected> den Bus." → {"relatedItem":"warten auf"}

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
