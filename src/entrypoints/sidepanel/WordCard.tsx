import type { ReactNode } from "react";
import type { SelectionData } from "../../hooks/useSelectionData";
import type { WordCard as WordCardData } from "../../types/wordCard";

type WordCardProps = {
  card: WordCardData;
  selection: SelectionData;
  relatedItem: string | null;
};

type CardFieldData = {
  id: string;
  label: string;
  content: ReactNode;
  tone?: "primary" | "supporting";
};

function CardField({
  label,
  content,
  tone = "supporting",
}: Omit<CardFieldData, "id">) {
  return (
    <section className={`word-card__field word-card__field--${tone}`}>
      <h2 className="word-card__field-label">{label}</h2>
      <div className="word-card__field-content">{content}</div>
    </section>
  );
}

export default function WordCard({ card, selection, relatedItem }: WordCardProps) {
  const fields: CardFieldData[] = [
    {
      id: "meaning",
      label: "Meaning",
      content: card.dictionaryDefinition,
      tone: "primary",
    },
    {
      id: "sentence",
      label: "In this sentence",
      content: selection.sentence ?? "No sentence found.",
    },
  ];

  if (card.notes?.length) {
    fields.push({
      id: "notes",
      label: "Notes",
      content: (
        <ul className="word-card__notes">
          {card.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ),
    });
  }

  return (
    <article className="word-card">
      <header className="word-card__header">
        <div className="word-card__heading">
          <h1 className="word-card__word">
            {selection.text}
          </h1>
          <p className="word-card__part-of-speech">{card.category}</p>
        </div>
      </header>

      <div className="word-card__body">
        {fields.map(({ id, ...field }) => (
          <CardField key={id} {...field} />
        ))}
      </div>
      {relatedItem && (
        <footer className="word-card__related-item">
          <span>Related item</span>
          <strong>{relatedItem}</strong>
        </footer>
      )}
    </article>
  );
}
