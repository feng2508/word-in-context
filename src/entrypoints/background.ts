import type { SelectionData } from "../hooks/useSelectionData";
import {
  requestExplanation,
  type ExplanationState,
} from "../services/deepseek";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to reach DeepSeek.";
}

async function requestAndStoreExplanation(selection: SelectionData) {
  try {
    const content = await requestExplanation(selection);
    const explanation: ExplanationState = { status: "success", content };

    await browser.storage.session.set({ currentExplanation: explanation });
  } catch (error) {
    console.error("[word-in-context] DeepSeek error:", error);

    const explanation: ExplanationState = {
      status: "error",
      message: getErrorMessage(error),
    };

    await browser.storage.session.set({ currentExplanation: explanation });
  }
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message.type !== "open-side-panel" || !sender.tab?.id) {
      return { ok: false };
    }

    try {
      // Start opening immediately from the Explain click.
      await browser.sidePanel.open({
        tabId: sender.tab.id,
      });

      // Save the selected word and sentence.
      await browser.storage.session.set({
        currentSelection: message.selection,
        currentExplanation: { status: "loading" } satisfies ExplanationState,
      });

      void requestAndStoreExplanation(message.selection as SelectionData);

      return { ok: true };
    } catch (error) {
      console.error("Failed to open the side panel:", error);
      return { ok: false };
    }
  });
});
