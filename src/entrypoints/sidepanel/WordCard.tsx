import { useState } from "react";
import type { SelectionData } from "../../hooks/useSelectionData";
import type { WordCard as WordCardData } from "../../types/wordCard";

type WordCardProps = {
  card: WordCardData;
  selection: SelectionData;
};

function formatCardForCopy(card: WordCardData, selection: SelectionData): string {
  const lines = [
    `Selected word: ${selection.text}`,
    ...(card.relevantExpression
      ? [`Relevant expression: ${card.relevantExpression}`]
      : []),
    `Part of speech: ${card.partOfSpeech}`,
    `Meaning in context (AI-generated): ${card.dictionaryDefinition}`,
    `Sentence: ${selection.sentence ?? "No sentence found."}`,
    ...(card.notes?.length
      ? ["Notes:", ...card.notes.map((note) => `- ${note}`)]
      : []),
  ];

  return lines.join("\n");
}

export default function WordCard({ card, selection }: WordCardProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatCardForCopy(card, selection));
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <article className="word-card">
      <header className="word-card__header">
        <div className="word-card__heading">
          <p className="word-card__eyebrow">Word card</p>
          <h1 className="word-card__word">
            {card.relevantExpression ?? selection.text}
          </h1>
          <p className="word-card__part-of-speech">{card.partOfSpeech}</p>
        </div>
        <button className="word-card__copy-button" type="button" onClick={handleCopy}>
          {copyStatus === "copied" ? "Copied" : "Copy card"}
        </button>
      </header>

      <div className="word-card__body">
        <section className="word-card__section">
          <div className="word-card__meaning-row">
            <p className="word-card__label">Meaning in context</p>
            <span className="word-card__badge">AI-generated</span>
          </div>
          <p className="word-card__value">{card.dictionaryDefinition}</p>
        </section>

        <section className="word-card__section word-card__sentence">
          <p className="word-card__label">Sentence</p>
          <p className="word-card__value">
            {selection.sentence ?? "No sentence found."}
          </p>
        </section>

        {card.notes?.length && (
          <section className="word-card__section word-card__note">
            <p className="word-card__label">
              {card.notes.length === 1 ? "Note" : "Notes"}
            </p>
            {card.notes.length === 1 ? (
              <p className="word-card__value">{card.notes[0]}</p>
            ) : (
              <ul className="word-card__notes">
                {card.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      <p className="word-card__copy-status" aria-live="polite">
        {copyStatus === "copied" && "Word card copied to clipboard."}
        {copyStatus === "error" && "Could not copy the word card."}
      </p>
    </article>
  );
}
