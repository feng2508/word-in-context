// src/entrypoints/sidepanel/App.tsx
import { useEffect, useState } from "react";
import type { Browser } from "@wxt-dev/browser";
import type { SelectionData } from "../../hooks/useSelectionData";
import type { WordCardState } from "../../types/wordCard";
import WordCard from "./WordCard";

export default function App() {
  const [selection, setSelection] = useState<SelectionData | null>(null);
  const [explanation, setExplanation] = useState<WordCardState | null>(null);

  useEffect(() => {
    function setCurrentSelection(currentSelection: unknown) {
      setSelection((currentSelection as SelectionData | null) ?? null);
    }

    function setCurrentExplanation(currentExplanation: unknown) {
      setExplanation((currentExplanation as WordCardState | null) ?? null);
    }

    browser.storage.session
      .get(["currentSelection", "currentExplanation"])
      .then(({ currentSelection, currentExplanation }) => {
        setCurrentSelection(currentSelection);
        setCurrentExplanation(currentExplanation);
      });

    function handleStorageChange(
      changes: Record<string, Browser.storage.StorageChange>,
      areaName: Browser.storage.AreaName,
    ) {
      if (areaName === "session" && changes.currentSelection) {
        setCurrentSelection(changes.currentSelection.newValue);
      }

      if (areaName === "session" && changes.currentExplanation) {
        setCurrentExplanation(changes.currentExplanation.newValue);
      }
    }

    browser.storage.onChanged.addListener(handleStorageChange);

    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  if (!selection) {
    return (
      <main className="sidepanel">
        <p className="empty-state">Select a word first.</p>
      </main>
    );
  }

  return (
    <main className="sidepanel">
      {explanation?.status === "loading" && (
        <p className="status-message">Creating word card…</p>
      )}

      {explanation?.status === "success" && (
        <WordCard card={explanation.card} selection={selection} />
      )}

      {explanation?.status === "error" && (
        <p className="error-message" role="alert">
          Could not create a word card: {explanation.message}
        </p>
      )}
    </main>
  );
}
