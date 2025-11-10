import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { base, baseSepolia } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { ReactNode } from "react";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://dashboard.reown.com
const projectId = import.meta.env.VITE_PROJECT_ID;

// 2. Create a metadata object - optional
const metadata = {
  name: "Builders Position",
  description: "Builders Position",
  url: "https://builders-position.vercel.app", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Set the networks
const rawNetworks = [base, baseSepolia] as const;
const networks = rawNetworks as unknown as [AppKitNetwork, ...AppKitNetwork[]];
// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
