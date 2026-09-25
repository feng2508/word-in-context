export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message.type !== "open-side-panel" || !sender.tab?.id) {
      return;
    }

    await browser.sidePanel.open({
      tabId: sender.tab.id,
    });
  });
});