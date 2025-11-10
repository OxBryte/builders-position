type LeaderboardPaginationProps = {
  currentPage: number;
  lastPage: number;
  total?: number;
  isFetching?: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function LeaderboardPagination({
  currentPage,
  lastPage,
  total,
  isFetching,
  onPrev,
  onNext,
}: LeaderboardPaginationProps) {
  if (lastPage <= 1) {
    return null;
  }

  return (
    <footer className="flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 sm:flex-row sm:gap-6">
      <div className="text-sm text-gray-500">
        Page{" "}
        <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
        <span className="font-semibold text-gray-900">{lastPage}</span>
        {typeof total === "number" ? (
          <>
            {" "}
            • <span className="font-medium text-gray-900">{total}</span> builders
          </>
        ) : null}
        {isFetching ? (
          <span className="ml-2 inline-flex items-center text-xs text-blue-500">
            Updating…
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentPage <= 1 || isFetching}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={currentPage >= lastPage || isFetching}
          className="inline-flex items-center gap-1 rounded-full border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:border-blue-200 disabled:bg-blue-200 disabled:text-white/70"
        >
          Next →
        </button>
      </div>
    </footer>
  );
}

