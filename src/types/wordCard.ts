export type WordCard = {
  partOfSpeech: string;
  dictionaryDefinition: string;
  relatedItem?: string;
  notes?: string[];
};

export type WordCardState =
  | { status: "loading" }
  | { status: "success"; card: WordCard }
  | { status: "error"; message: string }
  | { status: "missing-api-key" };
