// Single source of truth for round scoring, shared by the client (instant
// results) and the server (persisted records) so the two can't drift.
const computeWpm = ({
  charCount,
  startedAt,
  endedAt,
}: {
  charCount: number;
  startedAt: number;
  endedAt: number;
}) => {
  const minutes = (endedAt - startedAt) / 60_000;
  return minutes > 0 ? Math.round(charCount / 5 / minutes) : 0;
};

const computeAccuracy = ({
  charCount,
  typedCount,
}: {
  charCount: number;
  typedCount: number;
}) => (typedCount > 0 ? Math.round((charCount / typedCount) * 100) : 0);

export { computeWpm, computeAccuracy };
