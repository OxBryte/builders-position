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
    total_supporters?: number;
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

type TalentAccountsResponse =
  | {
      accounts?: TalentAccount[];
    }
  | {
      data?: {
        accounts?: TalentAccount[];
        account?: TalentAccount;
      };
      account?: TalentAccount;
    }
  | {
      account?: TalentAccount;
    };

const TALENT_API_URL = `${import.meta.env.VITE_BASE_URL}/accounts`;

function extractAccount(
  payload: TalentAccountsResponse | null
): TalentAccount | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (Array.isArray((payload as { accounts?: TalentAccount[] }).accounts)) {
    const [first] = (payload as { accounts: TalentAccount[] }).accounts;
    return first ?? null;
  }

  if ("data" in payload && payload.data && typeof payload.data === "object") {
    const data = payload.data as {
      accounts?: TalentAccount[];
      account?: TalentAccount;
    };
    if (Array.isArray(data.accounts)) {
      const [first] = data.accounts;
      if (first) return first;
    }
    if (data.account) {
      return data.account;
    }
  }

  if ("account" in payload && payload.account) {
    return payload.account;
  }

  return null;
}

async function fetchTalentProfile(address: string, token: string) {
  const url = new URL(TALENT_API_URL);
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

  const payload = (await response.json()) as TalentAccountsResponse;
  return extractAccount(payload);
}

export function useTalentProfile(address?: string) {
  const token = import.meta.env.VITE_API_KEY;
  const sanitizedAddress = address?.toLowerCase();
  const enabled = Boolean(sanitizedAddress && token);

  const query = useQuery<TalentAccount | null, Error>({
    queryKey: ["talent-profile", sanitizedAddress],
    queryFn: async () => {
      if (!sanitizedAddress || !token) {
        throw new Error("Missing wallet address or Talent Protocol token.");
      }
      return fetchTalentProfile(sanitizedAddress, token);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    tokenAvailable: Boolean(token),
  };
}
