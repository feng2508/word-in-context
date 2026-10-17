export type WordCard = {
  category: string;
  dictionaryDefinition: string;
  notes?: string[];
};

export type WordCardState =
  | { status: "loading" }
  | { status: "success"; card: WordCard }
  | { status: "error"; message: string }
  | { status: "missing-api-key" };

export type RelatedItemState =
  | { status: "loading" }
  | { status: "success"; item: string | null }
  | { status: "error" };

export type RelatedItemCardState =
  | { status: "loading"; item: string }
  | { status: "success"; item: string; card: WordCard }
  | { status: "error"; item: string; message: string };
