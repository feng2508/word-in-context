import { useEffect, useState } from "react";

type SelectionData = {
  text: string;
  sentence: string | null;
  position: {
    top: number;
    left: number;
  };
};

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

  const [panelData, setPanelData] = useState<{
    text: string;
    sentence: string | null;
  } | null>(null);

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
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return (
    <>
      {selection && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setPanelData({
              text: selection.text,
              sentence: selection.sentence,
            });

            setSelection(null);
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
      )}

      {panelData && (
        <aside
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: 360,
            height: "100vh",
            padding: 16,
            backgroundColor: "white",
            borderLeft: "1px solid #ddd",
            boxShadow: "-4px 0 12px rgba(0, 0, 0, 0.15)",
            zIndex: 2147483647,
          }}
        >
          <button
            type="button"
            onClick={() => setPanelData(null)}
            style={{ float: "right" }}
          >
            ×
          </button>

          <p>{panelData.text}</p>
          <p>{panelData.sentence}</p>
        </aside>
      )}
    </>
  );
}
