import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

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

const DEFAULT_BASE = import.meta.env.DEV
  ? "/builderscore"
  : "https://www.builderscore.xyz/api";

const BASE_URL = (import.meta.env.VITE_BUILDERSCORE_API ?? DEFAULT_BASE).replace(
  /\/$/,
  "",
);

type NormalizedOptions = {
  perPage: number;
  page: number;
  sponsorSlug: string;
  grantId: string | number;
};

function buildQuery({
  perPage = 50,
  page = 1,
  sponsorSlug = "walletconnect",
  grantId = 710,
}: NormalizedOptions) {
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

async function fetchLeaderboard(params: NormalizedOptions) {
  const response = await fetch(`${BASE_URL}/leaderboards?${buildQuery(params)}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = (await response.json()) as LeaderboardResponse;
  return json;
}

export function useLeaderboard(options: UseLeaderboardOptions = {}) {
  const {
    enabled = true,
    perPage = 50,
    page = 1,
    sponsorSlug = "walletconnect",
    grantId = 710,
  } = options;

  const queryParams = useMemo<NormalizedOptions>(
    () => ({
      perPage,
      page,
      sponsorSlug,
      grantId,
    }),
    [perPage, page, sponsorSlug, grantId],
  );

  const query = useQuery<LeaderboardResponse, Error>({
    queryKey: ["leaderboard", queryParams],
    queryFn: () => fetchLeaderboard(queryParams),
    enabled,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  return {
    data: query.data,
    error: query.error,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}