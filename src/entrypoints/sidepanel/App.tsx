// src/entrypoints/sidepanel/App.tsx
import { useEffect, useState } from "react";
import type { Browser } from "@wxt-dev/browser";
import type { SelectionData } from "../../hooks/useSelectionData";
import type { WordCardState } from "../../types/wordCard";

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
        <article className="word-card">
          <header className="word-card__header">
            <p className="word-card__eyebrow">Word card</p>
            <h1 className="word-card__word">
              {explanation.card.relevantExpression ?? selection.text}
            </h1>
            <p className="word-card__part-of-speech">
              {explanation.card.partOfSpeech}
            </p>
          </header>

          <div className="word-card__body">
            <section className="word-card__section">
              <div className="word-card__meaning-row">
                <p className="word-card__label">Meaning in context</p>
                <span className="word-card__badge">AI-generated</span>
              </div>
              <p className="word-card__value">
                {explanation.card.dictionaryDefinition}
              </p>
            </section>

            <section className="word-card__section word-card__sentence">
              <p className="word-card__label">Sentence</p>
              <p className="word-card__value">
                {selection.sentence ?? "No sentence found."}
              </p>
            </section>

            {explanation.card.note && (
              <section className="word-card__section word-card__note">
                <p className="word-card__label">Note</p>
                <p className="word-card__value">{explanation.card.note}</p>
              </section>
            )}
          </div>
        </article>
      )}

      {explanation?.status === "error" && (
        <p className="error-message" role="alert">
          Could not create a word card: {explanation.message}
        </p>
      )}
    </main>
  );
}
