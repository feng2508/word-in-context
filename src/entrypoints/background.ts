import { testDeepSeekConnection } from "../services/deepseek";

function logDeepSeekError(error: unknown) {
  console.error("[word-in-context] DeepSeek error:", error);
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
      });

      // Temporary first step: the Explain click triggers a fixed DeepSeek test.
      // Later, this will send message.selection.text and message.selection.sentence.
      void testDeepSeekConnection().catch(logDeepSeekError);

      return { ok: true };
    } catch (error) {
      console.error("Failed to open the side panel:", error);
      return { ok: false };
    }
  });
});
