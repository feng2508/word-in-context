import type { SelectionData } from "../../hooks/useSelectionData";
import type { WordCard as WordCardData } from "../../types/wordCard";

type WordCardProps = {
  card: WordCardData;
  selection: SelectionData;
};

export default function WordCard({ card, selection }: WordCardProps) {
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
    </article>
  );
}
