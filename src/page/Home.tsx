import Layout from "../components/layout/Layout";
import Navbar from "../components/layout/Navbar";
import { useLeaderboard } from "../hooks/useLeaderboard";

export default function Home() {
  const { data, isLoading, error } = useLeaderboard({
    perPage: 10,
    sponsorSlug: "walletconnect",
    grantId: 710,
  });

  return (
    <Layout>
      <Navbar />
      <section className="mt-8 space-y-4">
        <h1 className="text-2xl font-semibold">Leaderboard Snapshot</h1>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading leaderboard…</p>
        ) : error ? (
          <p className="text-sm text-red-500">
            Failed to load leaderboard: {error.message}
          </p>
        ) : (
          <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
            {data?.users.map((user) => (
              <article
                key={user.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="text-base font-medium">
                    {user.profile.display_name ?? user.profile.name ?? "Anon"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Rank #{user.leaderboard_position}
                  </p>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  {user.profile.scores?.[0]?.points ?? 0} pts
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}