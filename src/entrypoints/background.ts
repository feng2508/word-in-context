import type { SelectionData } from "../hooks/useSelectionData";
import { requestWordCard } from "../services/wordCard";
import type { WordCardState } from "../types/wordCard";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to reach DeepSeek.";
}

async function requestAndStoreWordCard(selection: SelectionData) {
  try {
    const card = await requestWordCard(selection);

    await browser.storage.session.set({
      currentExplanation: {
        status: "success",
        card,
      } satisfies WordCardState,
    });
  } catch (error) {
    console.error("[word-in-context] DeepSeek error:", error);

    await browser.storage.session.set({
      currentExplanation: {
        status: "error",
        message: getErrorMessage(error),
      } satisfies WordCardState,
    });
  }
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message, sender) => {
    const tabId = sender.tab?.id;

    if (message?.type !== "open-side-panel" || tabId == null) {
      return { ok: false };
    }

    try {
      // Start opening immediately from the Explain click.
      await browser.sidePanel.open({
        tabId,
      });

      // Save the selected word and sentence.
      await browser.storage.session.set({
        currentSelection: message.selection,
        currentExplanation: { status: "loading" } satisfies WordCardState,
      });

      void requestAndStoreWordCard(message.selection as SelectionData);

      return { ok: true };
    } catch (error) {
      console.error("Failed to open the side panel:", error);
      return { ok: false };
    }
  });
});
