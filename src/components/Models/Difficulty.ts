export enum Difficulty {
  VERY_EASY = "VERY_EASY",
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  VERY_HARD = "VERY_HARD",
  IMPOSSIBLE = "IMPOSSIBLE",
  WORST = "WORST",
}

export const DifficultyToDescription = new Map<Difficulty, string>([
  [Difficulty.VERY_EASY, "Sehr einfach"],
  [Difficulty.EASY, "Einfach"],
  [Difficulty.MEDIUM, "Medium"],
  [Difficulty.HARD, "Schwer"],
  [Difficulty.VERY_HARD, "Sehr schwer"],
  [Difficulty.IMPOSSIBLE, "Impossible"],
  [Difficulty.WORST, "Worst"],
]);

export const DifficultyToRecord = Object.keys(Difficulty).map((key) => ({
  value: key,
  text: DifficultyToDescription.get(key as Difficulty),
}));

export const DifficultyToColor = new Map<Difficulty, string>([
  [Difficulty.VERY_EASY, "green"],
  [Difficulty.EASY, "olive"],
  [Difficulty.MEDIUM, "yellow"],
  [Difficulty.HARD, "orange"],
  [Difficulty.VERY_HARD, "red"],
  [Difficulty.IMPOSSIBLE, "purple"],
  [Difficulty.WORST, "black"],
]);
