import type { SelectionData } from "../hooks/useSelectionData";
import { requestRelatedItem } from "../services/relatedItem";
import { getDeepSeekApiKey } from "../services/settings";
import { requestWordCard } from "../services/wordCard";
import type { RelatedItemState, WordCardState } from "../types/wordCard";

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
    void requestAndStoreRelatedItem(selection);
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

async function requestAndStoreRelatedItem(selection: SelectionData) {
  try {
    const item = await requestRelatedItem(selection);
    await browser.storage.session.set({
      currentRelatedItem: { status: "success", item } satisfies RelatedItemState,
    });
  } catch (error) {
    console.error("[word-in-context] related item error:", error);
    await browser.storage.session.set({
      currentRelatedItem: { status: "error" } satisfies RelatedItemState,
    });
  }
}

export default defineBackground(() => {
  void browser.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true,
  });

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

      const apiKey = await getDeepSeekApiKey();

      // Save the selected word and sentence.
      await browser.storage.session.set({
        currentSelection: message.selection,
        currentExplanation: apiKey
          ? ({ status: "loading" } satisfies WordCardState)
          : ({ status: "missing-api-key" } satisfies WordCardState),
        currentRelatedItem: apiKey
          ? ({ status: "loading" } satisfies RelatedItemState)
          : undefined,
      });

      if (apiKey) {
        void requestAndStoreWordCard(message.selection as SelectionData);
      }

      return { ok: true };
    } catch (error) {
      console.error("Failed to open the side panel:", error);
      return { ok: false };
    }
  });
});
