import { useEffect, useState } from "react";

type SelectionData = {
  text: string;
  sentence: string | null;
  position: {
    top: number;
    left: number;
  };
};

const [panelData, setPanelData] = useState<{
  text: string;
  sentence: string | null;
} | null>(null);

function getSelectedSentence(): string | null {
  const selection = window.getSelection();

  if (!selection?.rangeCount || selection.isCollapsed) {
    return null;
  }

  const selectedRange = selection.getRangeAt(0);

  const selectedElement =
    selectedRange.startContainer.nodeType === Node.ELEMENT_NODE
      ? (selectedRange.startContainer as Element)
      : selectedRange.startContainer.parentElement;

  const container =
    selectedElement?.closest("p, li, blockquote, article, div") ??
    document.body;

  const prefixRange = document.createRange();
  prefixRange.selectNodeContents(container);
  prefixRange.setEnd(selectedRange.startContainer, selectedRange.startOffset);

  const text = container.textContent ?? "";
  const selectedStart = prefixRange.toString().length;

  const sentences = [...text.matchAll(/[^.!?]+[.!?]+|[^.!?]+$/g)];

  const containingSentence = sentences.find((item) => {
    const start = item.index ?? 0;
    const end = start + item[0].length;

    return selectedStart >= start && selectedStart < end;
  });

  return containingSentence?.[0].trim() ?? null;
}

export default function SelectionAction() {
  const [selection, setSelection] = useState<SelectionData | null>(null);

  useEffect(() => {
    function handleSelectionChange() {
      const browserSelection = window.getSelection();
      const selectedText = browserSelection?.toString().trim();

      if (!browserSelection?.rangeCount || !selectedText) {
        // No selection or empty selection
        setSelection(null);
        return;
      }

      const range = browserSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelection({
        text: selectedText,
        sentence: getSelectedSentence(),
        position: {
          top: rect.bottom + 8,
          left: rect.left,
        },
      });
    }

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange); // Clean up the event listener when the component unmounts
    };
  }, []);

  if (!selection) {
    return null;
  }

  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => {
        setPanelData({
          text: selection.text,
          sentence: selection.sentence,
        });
        setSelection(null); // Clear the selection after clicking the button
      }}
      style={{
        position: "fixed",
        top: selection.position.top,
        left: selection.position.left,
        zIndex: 2147483647,
      }}
    >
      Explain
    </button>
  );
}
