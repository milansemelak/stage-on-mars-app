export const MAX_HISTORY = 50;
export const TRIAL_DAYS = 30;
export const STORAGE_KEYS = {
  playHistory: "som-play-history",
  prescriptions: "som-prescriptions",
  lang: "som-lang",
  email: "som-email",
  pendingQuestion: "som-pending-question",
  landingFreePlays: "som-landing-free-plays",
} as const;

export const LANDING_FREE_PLAY_LIMIT = 1;

/**
 * Returns a user-scoped localStorage key.
 * Data like play history and prescriptions are private per user.
 */
export function userKey(baseKey: string, userId: string | undefined): string {
  if (!userId) return baseKey;
  return `${baseKey}:${userId}`;
}
