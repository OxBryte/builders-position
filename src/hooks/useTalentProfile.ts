import { useQuery } from "@tanstack/react-query";

export type TalentAccount = {
  id?: string | number;
  wallet_address?: string;
  username?: string;
  name?: string;
  display_name?: string;
  headline?: string;
  summary?: string;
  bio?: string;
  about?: string;
  location?: string;
  country?: string;
  profile_picture_url?: string;
  profile_picture_data?: Record<string, unknown>;
  supporters_count?: number;
  total_supporters?: number;
  ens?: string;
  farcaster_primary_wallet_address?: string;
  human_checkmark?: boolean;
  main_wallet_address?: string;
  onchain_id?: number;
  onchain_since?: string;
  rank_position?: number;
  tags?: string[];
  stats?: {
    supporters?: number;
    total_support_volume?: number;
    talent_token_price?: number;
  };
  talent?: {
    supporters_count?: number;
    total_support_volume?: string | number;
    total_supply?: string | number;
    price?: string | number;
    market_cap?: string | number;
  };
  accounts?: Array<{
    identifier: string;
    source: string;
    username: string | null;
  }>;
  user?: {
    id?: string;
    human_checkmark?: boolean;
    main_wallet?: string;
  };
};

type TalentProfileResponse = {
  profile?: TalentAccount;
} | null;

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getProfileUrl = () => {
  if (!BASE_URL) {
    throw new Error("Missing VITE_BASE_URL environment variable.");
  }

  return `${BASE_URL}/profile`;
};

const fetchTalentProfile = async (
  address: string,
  token: string
): Promise<TalentAccount | null> => {
  const url = new URL(getProfileUrl());
  url.searchParams.set("id", address.toLowerCase());

  const response = await fetch(url.toString(), {
    headers: {
      "x-api-key": token,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Talent Protocol request failed (${response.status})`);
  }

  const payload = (await response.json()) as TalentProfileResponse;
  // console.log(payload?.profile, 'here');
  return payload?.profile ?? null;
};

export const useTalentProfile = (address?: string) => {
  const token = import.meta.env.VITE_API_KEY;
  const sanitizedAddress = address?.toLowerCase();

  const { data, error, isPending, isFetching, refetch } = useQuery<
    TalentAccount | null,
    Error
  >({
    queryKey: ["talent-profile", sanitizedAddress],
    queryFn: () => {
      if (!sanitizedAddress || !token) {
        throw new Error("Missing wallet address or Talent Protocol token.");
      }

      return fetchTalentProfile(sanitizedAddress, token);
    },
    enabled: Boolean(sanitizedAddress && token),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    profile: data ?? null,
    profileError: error,
    isLoadingProfile: isPending,
    isFetchingProfile: isFetching,
    refetchProfile: refetch,
    tokenAvailable: Boolean(token),
  };
};
