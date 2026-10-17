// src/entrypoints/sidepanel/App.tsx
import { useEffect, useState } from "react";
import type { Browser } from "@wxt-dev/browser";
import type { SelectionData } from "../../hooks/useSelectionData";
import type { RelatedItemState, WordCardState } from "../../types/wordCard";
import WordCard from "./WordCard";

export default function App() {
  const [selection, setSelection] = useState<SelectionData | null>(null);
  const [explanation, setExplanation] = useState<WordCardState | null>(null);
  const [relatedItem, setRelatedItem] = useState<RelatedItemState | null>(null);

  async function openSettings() {
    await browser.runtime.openOptionsPage();
  }

  useEffect(() => {
    function setCurrentSelection(currentSelection: unknown) {
      setSelection((currentSelection as SelectionData | null) ?? null);
    }

    function setCurrentExplanation(currentExplanation: unknown) {
      setExplanation((currentExplanation as WordCardState | null) ?? null);
    }
    function setCurrentRelatedItem(currentRelatedItem: unknown) {
      setRelatedItem((currentRelatedItem as RelatedItemState | null) ?? null);
    }

    browser.storage.session
      .get(["currentSelection", "currentExplanation", "currentRelatedItem"])
      .then(({ currentSelection, currentExplanation, currentRelatedItem }) => {
        setCurrentSelection(currentSelection);
        setCurrentExplanation(currentExplanation);
        setCurrentRelatedItem(currentRelatedItem);
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
      if (areaName === "session" && changes.currentRelatedItem) {
        setCurrentRelatedItem(changes.currentRelatedItem.newValue);
      }
    }

    browser.storage.onChanged.addListener(handleStorageChange);

    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  if (!selection) {
    return (
      <main className="sidepanel">
        <section className="empty-state">
          <h2 className="empty-state__heading">Select a word to get started</h2>
          <p className="empty-state__copy">
            Select a word on the page, then click Explain.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="sidepanel">
      {explanation?.status === "missing-api-key" && (
        <section className="missing-key-state">
          <h2 className="missing-key-state__heading">Add a DeepSeek API key</h2>
          <p className="missing-key-state__copy">
            Add your own DeepSeek API key to generate word cards.
          </p>
          <button
            className="missing-key-state__button"
            type="button"
            onClick={openSettings}
          >
            Open Settings
          </button>
        </section>
      )}

      {explanation?.status === "loading" && (
        <p className="status-message">Creating word card…</p>
      )}

      {explanation?.status === "success" && (
        <WordCard
          card={explanation.card}
          selection={selection}
          relatedItem={relatedItem?.status === "success" ? relatedItem.item : null}
        />
      )}

      {explanation?.status === "error" && (
        <p className="error-message" role="alert">
          Could not create a word card: {explanation.message}
        </p>
      )}
    </main>
  );
}
