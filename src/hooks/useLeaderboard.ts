import { useEffect, useState } from "react";

export type LeaderboardUser = {
  id: number;
  leaderboard_position: number;
  ranking_change: number | null;
  reward_amount: number;
  reward_transaction_hash: string | null;
  summary: string | null;
  profile: {
    id: string;
    display_name: string | null;
    name: string | null;
    bio: string | null;
    image_url: string | null;
    location: string | null;
    scores: Array<{
      slug: string;
      points: number;
      rank_position: number | null;
      last_calculated_at: string;
    }>;
  };
};

type LeaderboardResponse = {
  users: LeaderboardUser[];
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
  };
};

export type UseLeaderboardOptions = {
  perPage?: number;
  page?: number;
  sponsorSlug?: string;
  grantId?: string | number;
  enabled?: boolean;
};

const BASE_URL = "https://www.builderscore.xyz/api/leaderboards";

function buildQuery({
  perPage = 50,
  page = 1,
  sponsorSlug,
  grantId,
}: UseLeaderboardOptions) {
  const params = new URLSearchParams();
  params.set("per_page", String(perPage));
  params.set("page", String(page));

  if (sponsorSlug) {
    params.set("sponsor_slug", sponsorSlug);
  }

  if (grantId !== undefined) {
    params.set("grant_id", String(grantId));
  }

  return params.toString();
}

export function useLeaderboard(options: UseLeaderboardOptions = {}) {
  const { enabled = true, ...queryOptions } = options;
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${BASE_URL}?${buildQuery(queryOptions)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = (await response.json()) as LeaderboardResponse;
        setData(json);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [enabled, queryOptions.perPage, queryOptions.page, queryOptions.sponsorSlug, queryOptions.grantId]);

  return { data, isLoading, error };
}


