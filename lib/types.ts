export type Play = {
  name: string;
  image: string;
  characters: string;
  authorRole: string;
  endingPerspective: string;
  playerCount: { min: number; max: number };
  duration: string;
  mood: string;
  simulation?: string;
  perspectives?: string[];
};

export type Mode = "guide" | "self-service";

export type GenerateRequest = {
  question: string;
  mode: Mode;
  context?: string;
  lang?: "en" | "sk" | "cs";
};

export type GenerateResponse = {
  plays: Play[];
  questionAngle?: "it" | "us" | "me";
};
