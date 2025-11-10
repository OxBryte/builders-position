import { formatNumber } from "../../lib/utils";
import type { LeaderboardUser } from "./types";

type LeaderboardTopBuildersProps = {
  users: LeaderboardUser[];
};

function formatRankingChange(change: number | null | undefined) {
  if (change === null || change === undefined) {
    return { label: "—", tone: "neutral" as const };
  }

  if (change === 0) return { label: "0", tone: "neutral" as const };
  if (change > 0) return { label: `▲ ${change}`, tone: "positive" as const };

  return { label: `▼ ${Math.abs(change)}`, tone: "negative" as const };
}

function getBuilderScore(user: LeaderboardUser) {
  return (
    user.profile.scores?.find((score) => score.slug === "builder_score") ??
    user.profile.scores?.[0]
  );
}

export default function LeaderboardTopBuilders({
  users,
}: LeaderboardTopBuildersProps) {
  if (!users?.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      {users.map((user, index) => {
        const builderScore = getBuilderScore(user);
        const change = formatRankingChange(user.ranking_change);

        return (
          <article
            key={user.id}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white/90 text-gray-900 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/30" />
            <div className="relative flex h-full flex-col gap-6 p-6">
              <header className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  {index === 0 ? "①" : index === 1 ? "②" : "③"}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <span>Rank #{user.leaderboard_position}</span>
                    <span
                      className={
                        change.tone === "positive"
                          ? "text-emerald-600"
                          : change.tone === "negative"
                          ? "text-rose-500"
                          : "text-gray-400"
                      }
                    >
                      {change.label}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold leading-tight text-gray-900">
                    {user.profile.display_name ?? user.profile.name ?? "Anon"}
                  </h2>
                  {user.profile.location ? (
                    <p className="text-xs text-gray-500">
                      {user.profile.location}
                    </p>
                  ) : null}
                </div>
                <img
                  src={
                    user.profile.image_url ??
                    `https://avatar.vercel.sh/${
                      user.profile.display_name ?? "anon"
                    }`
                  }
                  alt={
                    user.profile.display_name ?? user.profile.name ?? "Builder"
                  }
                  className="h-14 w-14 rounded-3xl border border-gray-200 object-cover shadow-sm"
                />
              </header>

              {user.summary || user.profile.bio ? (
                <p className="line-clamp-4 text-sm leading-relaxed text-gray-600">
                  {user.summary ?? user.profile.bio}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  No public summary provided yet. Keep building!
                </p>
              )}

              <dl className="flex flex-wrap items-center gap-4 text-sm">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-gray-900 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Builder Score
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-blue-900">
                    {builderScore?.points ?? 0}
                  </dd>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-gray-900 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    Reward
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-amber-900">
                    {formatNumber(user.reward_amount ?? 0)}
                  </dd>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Movement
                  </dt>
                  <dd
                    className={`mt-1 text-lg font-semibold ${
                      change.tone === "positive"
                        ? "text-emerald-600"
                        : change.tone === "negative"
                        ? "text-rose-500"
                        : "text-gray-600"
                    }`}
                  >
                    {change.label}
                  </dd>
                </div>
              </dl>

              {user.tags?.length ? (
                <footer className="flex flex-wrap gap-2 text-xs text-gray-500">
                  {user.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-200 px-3 py-1 text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </footer>
              ) : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}
