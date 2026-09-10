export const pagination = {
  defaultLimit: 10,
  defaultOffset: 0,
  maxLimit: 1000,
};

export const contentText = {
  minLength: 20,
  maxLength: 150,
};

// Submissions above this are rejected as implausible.
export const record = {
  maxWpm: 3000,
};

// Generation triggers, checked lazily on /api/content.
export const contentPool = {
  minSize: 500,
  maxSize: 2000,
  staleAfterMs: 24 * 60 * 60 * 1000,
  batchSize: 20,
  cooldownMs: 60 * 60 * 1000,
};

// Rolling avg window; users need rankMinRounds rounds to appear on the leaderboard.
export const stats = {
  window: 10,
  rankMinRounds: 5,
  trendRounds: 15,
};
