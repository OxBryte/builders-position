import { useQuery } from "@tanstack/react-query";

const COINGECKO_ENDPOINT =
  "https://api.coingecko.com/api/v3/simple/price?ids=walletconnect-token&vs_currencies=usd";
"https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=bitcoin&names=Bitcoin&symbols=btc";
type CoingeckoResponse = {
  "walletconnect-token"?: {
    usd?: number;
  };
};

async function fetchWctPrice(): Promise<number | null> {
  const response = await fetch(COINGECKO_ENDPOINT, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Coingecko request failed (${response.status})`);
  }

  const json = (await response.json()) as CoingeckoResponse;
  const price = json["walletconnect-token"]?.usd;
  return typeof price === "number" && price > 0 ? price : null;
}

export function useWctPrice() {
  const query = useQuery<number | null, Error>({
    queryKey: ["wct-price"],
    queryFn: fetchWctPrice,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  return {
    priceUsd: query.data ?? null,
    isLoading: query.isLoading,
    isError: Boolean(query.error),
    error: query.error,
    refetch: query.refetch,
  };
}
