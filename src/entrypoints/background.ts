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

      return { ok: true };
    } catch (error) {
      console.error("Failed to open the side panel:", error);
      return { ok: false };
    }
  });
});