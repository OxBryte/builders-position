import { formatNumber, truncateText } from "../../lib/utils";
import { useWctPrice } from "../../../hooks/useWctPrice";
import type { LeaderboardUser } from "./types";

type LeaderboardTableProps = {
  users: LeaderboardUser[];
};

function getBuilderScore(user: LeaderboardUser) {
  return (
    user.profile.scores?.find((score) => score.slug === "builder_score") ??
    user.profile.scores?.[0]
  );
}

function formatRankingChange(change: number | null | undefined) {
  if (change === null || change === undefined) {
    return { label: "—", tone: "neutral" as const };
  }

  if (change === 0) return { label: "0", tone: "neutral" as const };
  if (change > 0) return { label: `▲ ${change}`, tone: "positive" as const };

  return { label: `▼ ${Math.abs(change)}`, tone: "negative" as const };
}

export default function LeaderboardTable({ users }: LeaderboardTableProps) {
  const {
    priceUsd,
    isLoading: priceLoading,
    isError: priceError,
  } = useWctPrice();

  if (!users?.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Trending Builders
        </h2>
        <p className="text-xs uppercase tracking-wide text-gray-400">
          {users.length} builders
        </p>
      </header>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide !font-medium text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-3 text-left !font-medium">
                Rank
              </th>
              <th scope="col" className="px-4 py-3 text-left !font-medium">
                Builder
              </th>
              <th scope="col" className="px-4 py-3 text-center !font-medium">
                Change
              </th>
              <th scope="col" className="px-4 py-3 text-right !font-medium">
                Score
              </th>
              <th scope="col" className="px-4 py-3 text-right !font-medium">
                Reward
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const builderScore = getBuilderScore(user);
              const change = formatRankingChange(user.ranking_change);

              return (
                <tr
                  key={user.id}
                  className="transition hover:bg-gray-50/80 cursor-pointer"
                >
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    #{user.leaderboard_position}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={
                            user.profile.image_url ??
                            `https://avatar.vercel.sh/${
                              user.profile.display_name ?? "anon"
                            }`
                          }
                          alt={user.profile.display_name ?? "Builder"}
                          className="h-14 w-14 rounded-xl border border-gray-200 object-cover shadow-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-gray-900">
                          {user.profile.display_name ??
                            user.profile.name ??
                            "Anon"}
                        </p>
                        {user.profile.bio && (
                          <p
                            className="text-xs text-gray-500"
                            title={user.profile.bio}
                          >
                            {truncateText(user.profile.bio, 40)}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-xs">
                    {change.label !== "—" ? (
                      <span
                        className={
                          change.tone === "positive"
                            ? "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-600"
                            : change.tone === "negative"
                            ? "inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-rose-600"
                            : "inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-600"
                        }
                      >
                        {change.label}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-500">
                        No change
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-600">
                    {builderScore?.points ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    <div className="flex flex-col items-end">
                      <span>{formatNumber(user.reward_amount ?? 0)} WCT</span>
                      <span className="text-xs font-medium text-gray-500">
                        {priceError
                          ? "—"
                          : priceLoading
                          ? "Loading…"
                          : priceUsd
                          ? `$${formatNumber(
                              (user.reward_amount ?? 0) * priceUsd
                            )}`
                          : "—"}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
