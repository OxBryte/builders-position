import type { useLeaderboard } from "../../../hooks/useLeaderboard";

export type LeaderboardData = NonNullable<ReturnType<typeof useLeaderboard>["data"]>;
export type LeaderboardUser = LeaderboardData["users"][number];

