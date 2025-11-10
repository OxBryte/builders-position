import { useMemo } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { formatNumber } from "../components/lib/utils";

type LeaderboardData = NonNullable<ReturnType<typeof useLeaderboard>["data"]>;
type LeaderboardUser = LeaderboardData["users"][number];

function getBuilderScore(user: LeaderboardUser) {
  return (
    user.profile.scores?.find((score) => score.slug === "builder_score") ??
    user.profile.scores?.[0]
  );
}

function formatRankingChange(change: number | null | undefined) {
  if (change === null || change === undefined)
    return { label: "—", tone: "neutral" };
  if (change === 0) return { label: "0", tone: "neutral" };
  if (change > 0) return { label: `▲ ${change}`, tone: "positive" };
  return { label: `▼ ${Math.abs(change)}`, tone: "negative" };
}

export default function LeaderboardPage() {
  const { data, isLoading, error } = useLeaderboard({
    perPage: 10,
    sponsorSlug: "walletconnect",
    grantId: 710,
  });

  const { highlights, rest } = useMemo(() => {
    if (!data?.users?.length) {
      return {
        highlights: [] as LeaderboardUser[],
        rest: [] as LeaderboardUser[],
      };
    }

    return {
      highlights: data.users.slice(0, 3),
      rest: data.users.slice(3),
    };
  }, [data?.users]);

  return (
    <section className="mt-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">
          WalletConnect Builders
        </h1>
        <p className="text-sm text-gray-500">
          Snapshot of the latest BuilderScore leaderboard for
          WalletConnect-funded projects.
        </p>
      </header>

      {isLoading && (
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 text-sm text-gray-600">
          Loading leaderboard…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6 text-sm text-red-700">
          Failed to load leaderboard: {error.message}
        </div>
      )}

      {!isLoading && !error && data?.users?.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 text-center text-sm text-gray-600">
          No leaderboard entries available yet.
        </div>
      )}

      {!isLoading && !error && data?.users?.length ? (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            {highlights.map((user, index) => {
              const builderScore = getBuilderScore(user);
              const change = formatRankingChange(user.ranking_change);

              return (
                <article
                  key={user.id}
                  className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100/60 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="absolute inset-x-0 -top-10 flex justify-center text-6xl opacity-10">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </div>
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        user.profile.image_url ??
                        `https://avatar.vercel.sh/${
                          user.profile.display_name ?? "anon"
                        }`
                      }
                      alt={
                        user.profile.display_name ??
                        user.profile.name ??
                        "Builder"
                      }
                      className="h-16 w-16 rounded-2xl border border-blue-100 object-cover"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          Rank #{user.leaderboard_position}
                        </span>
                        <span
                          className={[
                            "text-xs font-semibold",
                            change.tone === "positive"
                              ? "text-emerald-600"
                              : change.tone === "negative"
                              ? "text-rose-600"
                              : "text-gray-500",
                          ].join(" ")}
                        >
                          {change.label}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {user.profile.display_name ??
                          user.profile.name ??
                          "Anon"}
                      </h2>
                      {user.profile.bio ? (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {user.profile.bio}
                        </p>
                      ) : null}

                      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl border border-blue-100 bg-white/60 p-3">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                            Builder Score
                          </dt>
                          <dd className="mt-1 text-lg font-semibold text-blue-900">
                            {builderScore?.points ?? 0}
                          </dd>
                        </div>
                        <div className="rounded-2xl border border-amber-100 bg-white/60 p-3">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                            Reward
                          </dt>
                          <dd className="mt-1 text-lg font-semibold text-amber-900">
                            {formatNumber(user.reward_amount ?? 0)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  {user.summary ? (
                    <div className="mt-6 rounded-2xl border border-blue-100 bg-white/70 p-4 text-xs leading-relaxed text-gray-600">
                      {user.summary.split("\n\n").map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 12)}
                          className="mb-3 last:mb-0"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </section>

          {rest.length ? (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Trending Builders
              </h2>
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left">
                        Rank
                      </th>
                      <th scope="col" className="px-4 py-3 text-left">
                        Builder
                      </th>
                      <th
                        scope="col"
                        className="hidden px-4 py-3 text-left sm:table-cell"
                      >
                        Summary
                      </th>
                      <th scope="col" className="px-4 py-3 text-right">
                        Score
                      </th>
                      <th scope="col" className="px-4 py-3 text-right">
                        Reward
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rest.map((user) => {
                      const builderScore = getBuilderScore(user);
                      const change = formatRankingChange(user.ranking_change);

                      return (
                        <tr key={user.id} className="hover:bg-gray-50/60">
                          <td className="px-4 py-3 font-semibold text-gray-700">
                            #{user.leaderboard_position}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  user.profile.image_url ??
                                  `https://avatar.vercel.sh/${
                                    user.profile.display_name ?? "anon"
                                  }`
                                }
                                alt={user.profile.display_name ?? "Builder"}
                                className="h-10 w-10 rounded-xl border border-gray-200 object-cover"
                              />
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
                          </td>
                          <td className="hidden max-w-xs px-4 py-3 text-gray-600 sm:table-cell">
                            {user.summary ? (
                              <p className="line-clamp-3 text-xs leading-relaxed">
                                {user.summary}
                              </p>
                            ) : (
                              <span className="text-xs text-gray-400">
                                No summary yet
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-blue-600">
                            {builderScore?.points ?? 0}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-amber-600">
                            {formatNumber(user.reward_amount ?? 0)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
