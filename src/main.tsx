import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppKitProvider } from "@reown/appkit-react";
import { base, baseSepolia } from "viem/chains";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppKitProvider
      projectId={import.meta.env.VITE_PROJECT_ID}
      network={[base, baseSepolia]}
    >
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <App />
      </QueryClientProvider>
    </AppKitProvider>
  </StrictMode>
);
