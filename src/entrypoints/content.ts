function getSelectedSentence(): string | null {
  const selection = window.getSelection();
  if (!selection?.rangeCount || selection.isCollapsed) return null;

  const selectedRange = selection.getRangeAt(0);
  const selectedElement =
    selectedRange.startContainer.nodeType === Node.ELEMENT_NODE
      ? (selectedRange.startContainer as Element)
      : selectedRange.startContainer.parentElement;

  const container =
    selectedElement?.closest('p, li, blockquote, article, div') ?? document.body;

  // Measure where the selection begins within the container's text.
  const prefixRange = document.createRange();
  prefixRange.selectNodeContents(container);
  prefixRange.setEnd(
    selectedRange.startContainer,
    selectedRange.startOffset,
  );

  const text = container.textContent ?? '';
  const selectedStart = prefixRange.toString().length;

  // Find the sentence containing that character position.
  const sentences = [...text.matchAll(/[^.!?]+[.!?]+|[^.!?]+$/g)];
  const match = sentences.find((item) => {
    const start = item.index ?? 0;
    const end = start + item[0].length;
    return selectedStart >= start && selectedStart < end;
  });

  return match?.[0].trim() ?? null;
}


export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    document.addEventListener('selectionchange', () => {
      const selectedText = window.getSelection()?.toString().trim();
      if (!selectedText) return;
      const sentence = getSelectedSentence();

      console.log("Selected word:", selectedText);
      console.log("Containing sentence:", sentence);

    });
  },
});
