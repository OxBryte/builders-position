import { useEffect, useMemo, useState } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import LeaderboardTopBuilders from "../components/features/leaderboard/LeaderboardTopBuilders";
import LeaderboardTable from "../components/features/leaderboard/LeaderboardTable";
import LeaderboardPagination from "../components/features/leaderboard/LeaderboardPagination";

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useLeaderboard({
    perPage: 10,
    sponsorSlug: "walletconnect",
    grantId: 710,
    page,
  });

  const pagination = data?.pagination;
  const totalPages = pagination?.last_page ?? 1;
  const totalEntries = pagination?.total ?? 0;

  useEffect(() => {
    if (pagination?.last_page && page > pagination.last_page) {
      setPage(pagination.last_page);
    }
  }, [pagination?.last_page, page]);

  useEffect(() => {
    if (pagination?.current_page && pagination.current_page !== page) {
      setPage(pagination.current_page);
    }
  }, [pagination?.current_page, page]);

  const { highlights, rest } = useMemo(() => {
    if (!data?.users?.length) {
      return { highlights: [], rest: [] };
    }

    return {
      highlights: data.users.slice(0, 3),
      rest: data.users.slice(3),
    };
  }, [data?.users]);

  return (
    <section className="mt-8 space-y-10">
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
          <LeaderboardTopBuilders users={highlights} />
          <LeaderboardTable users={rest} />
          <LeaderboardPagination
            currentPage={pagination?.current_page ?? page}
            lastPage={totalPages}
            total={totalEntries}
            onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            isLoading={isLoading}
          />
        </>
      ) : null}
    </section>
  );
}
