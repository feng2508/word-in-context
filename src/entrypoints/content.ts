export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    document.addEventListener('selectionchange', () => {
      const selectedText = window.getSelection()?.toString().trim();

      if (selectedText) {
        console.log(selectedText);
      }
    });
  },
});
