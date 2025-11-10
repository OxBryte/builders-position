import { useEffect, useMemo, useState } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import LeaderboardTopBuilders from "../components/features/leaderboard/LeaderboardTopBuilders";
import LeaderboardTable from "../components/features/leaderboard/LeaderboardTable";
import LeaderboardPagination from "../components/features/leaderboard/LeaderboardPagination";

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching } = useLeaderboard({
    perPage: 30,
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
      rest: data.users,
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
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-[var(--card-bg)] p-6 text-sm text-gray-600">
          <svg
            className="h-5 w-5 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
              5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading leaderboard…</span>
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
          {/* <LeaderboardTopBuilders users={highlights} /> */}
          <LeaderboardTable users={rest} />
          <LeaderboardPagination
            currentPage={pagination?.current_page ?? page}
            lastPage={totalPages}
            total={totalEntries}
            onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            isFetching={isFetching && !isLoading}
          />
        </>
      ) : null}
    </section>
  );
}
