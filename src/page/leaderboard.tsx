import { useEffect, useMemo, useState } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import LeaderboardTable from "../components/features/leaderboard/LeaderboardTable";
import LeaderboardPagination from "../components/features/leaderboard/LeaderboardPagination";

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error, isFetching } = useLeaderboard({
    perPage: searchTerm ? 200 : 30,
    sponsorSlug: "walletconnect",
    grantId: 710,
    page: searchTerm ? 1 : page,
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

  const filteredUsers = useMemo(() => {
    if (!data?.users?.length) {
      return [];
    }

    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return data.users;
    }

    return data.users.filter((user) => {
      const name = user.profile.display_name ?? user.profile.name ?? "";
      const bio = user.profile.bio ?? "";
      const summary = user.summary ?? "";
      const location = user.profile.location ?? "";

      return (
        name.toLowerCase().includes(term) ||
        bio.toLowerCase().includes(term) ||
        summary.toLowerCase().includes(term) ||
        location.toLowerCase().includes(term) ||
        user.leaderboard_position.toString().includes(term)
      );
    });
  }, [data?.users, searchTerm]);

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

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-600">
          Search builders
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => {
              const value = event.target.value;
              setSearchTerm(value);
              if (value) {
                setPage(1);
              }
            }}
            placeholder="Search by name, bio, summary, or rank…"
            className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm outline-none transition focus:border-blue-400 focus:ring focus:ring-blue-100"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="rounded-full border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
            >
              Clear
            </button>
          ) : null}
        </div>
        {searchTerm ? (
          <p className="mt-2 text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredUsers.length}
            </span>{" "}
            result{filteredUsers.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-gray-700">“{searchTerm}”</span>
          </p>
        ) : null}
      </div>

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

      <div className="space-y-4">
        {isLoading ? (
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
        ) : filteredUsers.length ? (
          <LeaderboardTable users={filteredUsers} />
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-[var(--card-bg)] p-6 text-center text-sm text-gray-500 shadow-sm">
            No builders matched your search.
          </div>
        )}

        <LeaderboardPagination
          currentPage={pagination?.current_page ?? page}
          lastPage={totalPages}
          total={totalEntries}
          onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
          onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          isFetching={isFetching}
          forceVisible={isLoading || Boolean(searchTerm)}
        />
      </div>
    </section>
  );
}
