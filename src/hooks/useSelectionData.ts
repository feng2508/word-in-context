import { useEffect, useState } from "react";

export type SelectionData = {
  text: string;
  sentence: string | null;
  markedSentence: string | null;
  position: {
    top: number;
    left: number;
  };
};

type SentenceContext = {
  sentence: string;
  markedSentence: string;
};

function getSelectedSentenceContext(): SentenceContext | null {
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
  prefixRange.setEnd(selectedRange.endContainer, selectedRange.endOffset);
  const selectedEnd = prefixRange.toString().length;

  const sentences = [...text.matchAll(/[^.!?]+[.!?]+|[^.!?]+$/g)];

  const containingSentence = sentences.find((item) => {
    const start = item.index ?? 0;
    const end = start + item[0].length;

    return selectedStart >= start && selectedEnd <= end;
  });

  if (!containingSentence) {
    return null;
  }

  const rawSentence = containingSentence[0];
  const sentenceStart = containingSentence.index ?? 0;
  const leadingWhitespace = rawSentence.length - rawSentence.trimStart().length;
  const sentence = rawSentence.trim();
  const selectionStart = selectedStart - sentenceStart - leadingWhitespace;
  const selectionEnd = selectedEnd - sentenceStart - leadingWhitespace;

  return {
    sentence,
    markedSentence: `${sentence.slice(0, selectionStart)}<selected>${sentence.slice(
      selectionStart,
      selectionEnd,
    )}</selected>${sentence.slice(selectionEnd)}`,
  };
}

export function useSelectionData(): {
  selection: SelectionData | null;
  clearSelection: () => void;
} {
  const [selection, setSelection] = useState<SelectionData | null>(null);

  useEffect(() => {
    function handleSelectionChange() {
      const browserSelection = window.getSelection();
      const selectedText = browserSelection?.toString().trim();

      if (!browserSelection?.rangeCount || !selectedText) {
        setSelection(null);
        return;
      }

      const range = browserSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const sentenceContext = getSelectedSentenceContext();

      setSelection({ // Set the selection data
        text: selectedText,
        sentence: sentenceContext?.sentence ?? null,
        markedSentence: sentenceContext?.markedSentence ?? null,
        position: {
          top: rect.bottom + 8,
          left: rect.left,
        },
      });
    }

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return {
    selection,
    clearSelection: () => setSelection(null), // Clear the selection data
  };
}
