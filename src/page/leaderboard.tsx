import { useEffect, useMemo, useState } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import LeaderboardTable from "../components/features/leaderboard/LeaderboardTable";
import LeaderboardPagination from "../components/features/leaderboard/LeaderboardPagination";

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sponsorSlug, setSponsorSlug] = useState("walletconnect");
  const [grantId, setGrantId] = useState<number | undefined>(710);
  const [timeframe, setTimeframe] = useState<"all" | "week" | "month">("all");

  const { data, isLoading, error, isFetching } = useLeaderboard({
    perPage: searchTerm ? 200 : 30,
    sponsorSlug,
    grantId,
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
    <section className="mt-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">
          WalletConnect Builders
        </h1>
        <p className="text-sm text-gray-500">
          Snapshot of the latest BuilderScore leaderboard for
          WalletConnect-funded projects.
        </p>
      </header>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <label
              htmlFor="sponsor-filter"
              className="text-sm font-medium text-gray-600"
            >
              Filter by sponsor
            </label>
            <select
              id="sponsor-filter"
              value={sponsorSlug}
              onChange={(event) => {
                const value = event.target.value;
                setSponsorSlug(value);
                setPage(1);

                switch (value) {
                  case "walletconnect":
                    setGrantId(710);
                    break;
                  case "base-summer":
                    setGrantId(414);
                    break;
                  case "base-spring":
                    setGrantId(511);
                    break;
                  default:
                    setGrantId(undefined);
                }
              }}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring focus:ring-blue-100"
            >
              <option value="walletconnect">WalletConnect</option>
              <option value="base-summer">Base (Summer)</option>
              <option value="base-spring">Base (Spring)</option>
              <option value="syndicate">Syndicate</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1">
            {[
              { value: "all", label: "All" },
              { value: "week", label: "This Week" },
              { value: "month", label: "Last Month" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setTimeframe(option.value as typeof timeframe);
                  setPage(1);
                }}
                className={[
                  "rounded-full px-4 py-1.5 text-sm font-medium transition",
                  timeframe === option.value
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
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
              className="w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring focus:ring-blue-100"
            />
          </div>
          {searchTerm ? (
            <p className="mt-2 text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredUsers.length}
              </span>{" "}
              result{filteredUsers.length === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-gray-700">
                “{searchTerm}”
              </span>
            </p>
          ) : null}
        </div>
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
