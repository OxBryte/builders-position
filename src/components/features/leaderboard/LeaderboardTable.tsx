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
                        {user.profile.human_checkmark ? (
                          <span className="absolute -bottom-1 -right-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm ring-2 ring-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-3.5 w-3.5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-1">
                        {user.profile.bio && (
                          <p
                            className="text-xs text-gray-500"
                            title={user.profile.bio}
                          >
                            {truncateText(user.profile.bio, 40)}
                          </p>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.profile.display_name ??
                              user.profile.name ??
                              "Anon"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {change.label !== "—" ? (
                              <span
                                className={
                                  change.tone === "positive"
                                    ? "text-emerald-600"
                                    : change.tone === "negative"
                                    ? "text-rose-600"
                                    : "text-gray-500"
                                }
                              >
                                {change.label}
                              </span>
                            ) : (
                              "No change"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
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
