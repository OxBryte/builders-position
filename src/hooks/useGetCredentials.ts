import { useQuery } from "@tanstack/react-query";

export type TalentCredential = {
  id: string | number;
  title?: string;
  name?: string;
  description?: string;
  issuer?: string;
  organization?: {
    name?: string;
    logo_url?: string;
  };
  issued_at?: string;
  received_at?: string;
  status?: string;
  url?: string;
  evidence_url?: string;
  metadata?: Record<string, unknown>;
};

type CredentialsResponse =
  | TalentCredential[]
  | {
      credentials?: TalentCredential[];
    }
  | {
      data?: {
        credentials?: TalentCredential[];
      };
    };

const BASE_URL = import.meta.env.VITE_BASE_URL;

function normalizeCredentials(payload: CredentialsResponse | null): TalentCredential[] {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if ("credentials" in payload && Array.isArray(payload.credentials)) {
    return payload.credentials;
  }

  if ("data" in payload && payload.data && typeof payload.data === "object") {
    const data = payload.data as { credentials?: TalentCredential[] };
    if (Array.isArray(data.credentials)) {
      return data.credentials;
    }
  }

  return [];
}

async function fetchCredentials(address: string, token: string) {
  if (!BASE_URL) {
    throw new Error("Missing VITE_BASE_URL environment variable.");
  }

  const url = new URL(`${BASE_URL.replace(/\/$/, "")}/accounts/${address}/credentials`);

  const response = await fetch(url.toString(), {
    headers: {
      "x-api-key": token,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Talent Protocol credentials request failed (${response.status})`);
  }

  const payload = (await response.json()) as CredentialsResponse;
  return normalizeCredentials(payload);
}

export function useGetCredentials(address?: string) {
  const token = import.meta.env.VITE_API_KEY;
  const sanitizedAddress = address?.toLowerCase();
  const enabled = Boolean(sanitizedAddress && token);

  const query = useQuery<TalentCredential[], Error>({
    queryKey: ["talent-credentials", sanitizedAddress],
    queryFn: async () => {
      if (!sanitizedAddress || !token) {
        throw new Error("Missing wallet address or Talent Protocol token.");
      }

      return fetchCredentials(sanitizedAddress, token);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: [],
  });

  return {
    ...query,
    tokenAvailable: Boolean(token),
  };
}

