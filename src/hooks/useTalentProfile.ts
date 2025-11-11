import { useQuery } from "@tanstack/react-query";

export type TalentAccount = {
  id: string | number;
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
  talent?: {
    supporters_count?: number;
    total_support_volume?: string | number;
    total_supply?: string | number;
    price?: string | number;
    market_cap?: string | number;
  };
  stats?: {
    supporters?: number;
    total_support_volume?: number;
    talent_token_price?: number;
  };
};

type TalentProfileResponse =
  | { accounts?: TalentAccount[] }
  | {
      data?: {
        accounts?: TalentAccount[];
        account?: TalentAccount;
      };
      account?: TalentAccount;
    }
  | { account?: TalentAccount }
  | null;

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PROFILE_ENDPOINT = "/profile";

const getProfileUrl = () => {
  if (!BASE_URL) {
    throw new Error("Missing VITE_BASE_URL environment variable.");
  }

  return `${BASE_URL}${PROFILE_ENDPOINT}`;
};

function extractAccount(payload: TalentProfileResponse): TalentAccount | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if ("accounts" in payload && Array.isArray(payload.accounts)) {
    return payload.accounts[0] ?? null;
  }

  if ("data" in payload && payload.data && typeof payload.data === "object") {
    const { accounts, account } = payload.data;
    if (Array.isArray(accounts) && accounts.length > 0) {
      return accounts[0] ?? null;
    }
    if (account) {
      return account;
    }
  }

  if ("account" in payload && payload.account) {
    return payload.account;
  }

  return null;
}

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
  return extractAccount(payload);
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
