import { useMemo } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { formatNumber } from "../components/lib/utils";

function getBuilderScore(user: (typeof data.users)[number]) {
  return (
    user.profile.scores?.find((score) => score.slug === "builder_score") ??
    user.profile.scores?.[0]
  );
}
