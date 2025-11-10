import type { ChangeEvent } from "react";

type LeaderboardFiltersProps = {
  sponsorSlug: string;
  onSponsorChange: (slug: string) => void;
  timeframe: "all" | "latest" | "lastMonth";
  onTimeframeChange: (frame: "all" | "latest" | "lastMonth") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultsCount: number;
};

export default function LeaderboardFilters({
  sponsorSlug,
  onSponsorChange,
  timeframe,
  onTimeframeChange,
  searchTerm,
  onSearchChange,
  resultsCount,
}: LeaderboardFiltersProps) {
  const handleSponsorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSponsorChange(event.target.value);
  };

  const segments: Array<{
    value: "all" | "latest" | "lastMonth";
    label: string;
  }> = [
    { value: "all", label: "All" },
    { value: "latest", label: "Latest" },
    { value: "lastMonth", label: "Last Month" },
  ];

  return (
    <div className="mt-3 space-y-4">
      <div className="flex flex-col rounded-lg gap-3 border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <select
          id="sponsor-filter"
          value={sponsorSlug}
          onChange={handleSponsorChange}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring focus:ring-blue-100"
        >
          <option value="walletconnect">WalletConnect</option>
          <option value="base-summer">Base (Summer League)</option>
          <option value="base">Base (Spring League)</option>
          <option value="syndicate">Syndicate</option>
        </select>

        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1">
          {segments.map((segment) => (
            <button
              key={segment.value}
              type="button"
              onClick={() => onTimeframeChange(segment.value)}
              className={[
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                timeframe === segment.value
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              ].join(" ")}
            >
              {segment.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, bio, summary, or rank…"
            className="w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring focus:ring-blue-100"
          />
        </div>
        {searchTerm ? (
          <p className="mt-2 text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">{resultsCount}</span>{" "}
            result{resultsCount === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-gray-700">“{searchTerm}”</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
