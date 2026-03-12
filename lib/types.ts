export type Play = {
  name: string;
  image: string;
  characters: string;
  authorRole: string;
  endingPerspective: string;
  playerCount: { min: number; max: number };
  duration: string;
  mood: string;
};

export type Mode = "guide" | "self-service";

export type GenerateRequest = {
  question: string;
  mode: Mode;
  context?: string;
};

export type GenerateResponse = {
  plays: Play[];
  questionAngle?: "it" | "us" | "me";
};
