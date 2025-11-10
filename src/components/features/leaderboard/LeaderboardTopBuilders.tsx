import { Fragment } from "react";
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

const gradientClasses = [
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-sky-500 via-blue-500 to-indigo-500",
  "from-amber-500 via-orange-500 to-rose-500",
];

export default function LeaderboardTopBuilders({
  users,
}: LeaderboardTopBuildersProps) {
  if (!users?.length) {
    return null;
  }

  return (
    <section className="grid gap-6 md:grid-cols-3">
      {users.map((user, index) => {
        const builderScore = getBuilderScore(user);
        const change = formatRankingChange(user.ranking_change);
        const gradient = gradientClasses[index] ?? gradientClasses[0];

        return (
          <article
            key={user.id}
            className="group relative overflow-hidden rounded-4xl bg-slate-900 text-white shadow-lg ring-1 ring-slate-800 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-70 mix-blend-screen transition group-hover:opacity-90`}
            />
            <div className="relative flex h-full flex-col gap-6 p-6">
              <header className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-white/80">
                    <span>Rank #{user.leaderboard_position}</span>
                    <span
                      className={
                        change.tone === "positive"
                          ? "text-emerald-200"
                          : change.tone === "negative"
                          ? "text-rose-200"
                          : "text-white/70"
                      }
                    >
                      {change.label}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold leading-tight text-white">
                    {user.profile.display_name ?? user.profile.name ?? "Anon"}
                  </h2>
                  {user.profile.location ? (
                    <p className="text-xs text-white/70">
                      {user.profile.location}
                    </p>
                  ) : null}
                </div>
                <img
                  src={
                    user.profile.image_url ??
                    `https://avatar.vercel.sh/${user.profile.display_name ?? "anon"}`
                  }
                  alt={user.profile.display_name ?? user.profile.name ?? "Builder"}
                  className="h-14 w-14 rounded-3xl border border-white/20 object-cover shadow-sm"
                />
              </header>

              {user.summary || user.profile.bio ? (
                <p className="line-clamp-4 text-sm leading-relaxed text-white/80">
                  {user.summary ?? user.profile.bio}
                </p>
              ) : (
                <p className="text-sm text-white/60">
                  No public summary provided yet. Keep building!
                </p>
              )}

              <dl className="flex flex-wrap items-center gap-4 text-sm">
                <div className="rounded-2xl bg-white/20 px-4 py-3 text-white shadow-sm backdrop-blur">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-white/70">
                    Builder Score
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-white">
                    {builderScore?.points ?? 0}
                  </dd>
                </div>
                <div className="rounded-2xl bg-black/20 px-4 py-3 text-white shadow-sm backdrop-blur">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-white/70">
                    Reward
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-white">
                    {formatNumber(user.reward_amount ?? 0)}
                  </dd>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-white shadow-sm backdrop-blur">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-white/70">
                    Movement
                  </dt>
                  <dd
                    className={`mt-1 text-lg font-semibold ${
                      change.tone === "positive"
                        ? "text-emerald-200"
                        : change.tone === "negative"
                        ? "text-rose-200"
                        : "text-white"
                    }`}
                  >
                    {change.label}
                  </dd>
                </div>
              </dl>

              {user.tags?.length ? (
                <footer className="flex flex-wrap gap-2 text-xs text-white/70">
                  {user.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/20 px-3 py-1"
                    >
                      #{tag}
                    </span>
                  ))}
                </footer>
              ) : null}

              {user.summary ? (
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-xs leading-relaxed text-white/80 shadow-inner">
                  {user.summary.split("\n\n").map((paragraph) => (
                    <Fragment key={paragraph.slice(0, 16)}>
                      <p className="mb-3 last:mb-0">{paragraph}</p>
                    </Fragment>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}

