export type WordCard = {
  partOfSpeech: string;
  dictionaryDefinition: string;
  relevantExpression?: string;
  note?: string;
};

export type WordCardState =
  | { status: "loading" }
  | { status: "success"; card: WordCard }
  | { status: "error"; message: string };