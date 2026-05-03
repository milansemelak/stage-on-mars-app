export type Character = {
  name: string;
  description: string;
};

export type SimulationStep = {
  narration: string;
  positions: Record<string, string>; // character name → position keyword
};

export type Perspective = {
  character: string;
  insight: string;
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
  perspectives?: (string | Perspective)[];
  takeawayWord?: string;
  followUpQuestion?: string;
};

export type HistoryEntry = {
  question: string;
  context: string;
  play: Play;
  timestamp: number;
  favorite?: boolean;
  rxNumber?: string;
  clientName?: string;
  threadId?: string;
  id?: string; // Supabase UUID, present after server sync
};

// Server-side play record (matches Supabase `plays` table)
export type PlayRecord = {
  id: string;
  user_id: string;
  question: string;
  context: string;
  play_data: Play;
  timestamp: number;
  favorite: boolean;
  rx_number: string | null;
  client_name: string | null;
  thread_id: string | null;
  created_at: string;
};

// Grouped thread of plays
export type PlayThread = {
  threadId: string;
  entries: HistoryEntry[];
  firstQuestion: string;
  lastTimestamp: number;
};

export type GenerateRequest = {
  question: string;
  context?: string;
  lang?: "en" | "sk" | "cs";
  clientName?: string;
  count?: number;
};

export type GenerateResponse = {
  plays: Play[];
  questionAngle?: "it" | "us" | "me";
};

export type Mission = {
  id: string;
  code: string;
  company: string;
  question: string;
  date: string;
  location: string;
  group_size: string;
  venue: string;
  welcome_message: string;
  spotify_url: string;
  rules: string;
  host_name: string;
  host_email: string;
  time: string;
  captain: string;
  facilitator: string;
  dresscode: string;
  maps_url: string;
  password: string;
  created_at: string;
};

export type CrewRegistration = {
  id: string;
  mission_id: string;
  name: string;
  email: string;
  question: string;
  registered_at: string;
};
