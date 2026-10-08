export type WordCard = {
  relevantExpression: string;
  meaning: string;
};

export type WordCardState =
  | { status: "loading" }
  | { status: "success"; card: WordCard }
  | { status: "error"; message: string };
