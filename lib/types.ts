export type Character = {
  name: string;
  description: string;
};

export type SimulationStep = {
  narration: string;
  positions: Record<string, string>; // character name → position keyword
};

export type Play = {
  name: string;
  image: string;
  characters: Character[];
  authorRole: string;
  endingPerspective: string;
  playerCount: { min: number; max: number };
  duration: string;
  mood: string;
  simulation?: string;
  simulationSteps?: SimulationStep[];
  perspectives?: string[];
};

export type HistoryEntry = {
  question: string;
  context: string;
  play: Play;
  timestamp: number;
  favorite?: boolean;
  rxNumber?: string;
  clientName?: string;
};

export type GenerateRequest = {
  question: string;
  context?: string;
  lang?: "en" | "sk" | "cs";
  clientName?: string;
};

export type GenerateResponse = {
  plays: Play[];
  questionAngle?: "it" | "us" | "me";
};
