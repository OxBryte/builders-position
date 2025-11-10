import { useQuery } from "@tanstack/react-query";

const LLAMA_SOURCES = [
  {
    key: "coingecko:walletconnect-token",
    url: "https://coins.llama.fi/prices/current/coingecko:walletconnect-token",
  },
  {
    key: "coingecko:walletconnect",
    url: "https://coins.llama.fi/prices/current/coingecko:walletconnect",
  },
  {
    key: "ethereum:0x0cec1a9154ff802e7934fc916ed7ca50e7f7310f",
    url: "https://coins.llama.fi/prices/current/ethereum:0x0cec1a9154ff802e7934fc916ed7ca50e7f7310f",
  },
];

type LlamaResponse = {
  coins?: Record<string, { price?: number }>;
};

async function fetchWctPrice(): Promise<number | null> {
  for (const source of LLAMA_SOURCES) {
    try {
      const response = await fetch(source.url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        continue;
      }

      const json = (await response.json()) as LlamaResponse;
      const price = json?.coins?.[source.key]?.price;

      if (typeof price === "number" && price > 0) {
        return price;
      }
    } catch (error) {
      console.warn(
        `[useWctPrice] Failed to fetch price from ${source.key}`,
        (error as Error).message
      );
    }
  }

  return null;
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
