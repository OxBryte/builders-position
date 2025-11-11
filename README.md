# Builders Position

Builders Position is a React + TypeScript application bootstrapped with Vite. It integrates WalletConnect’s AppKit, TanStack Query, and the BuilderScore API to showcase on-chain builder activity.

## Features

- **WalletConnect AppKit** integration via `@reown/appkit` and `wagmi`, configured for Base/Base Sepolia in `src/Provider.tsx`.
- **Home profile hub** powered by `useTalentProfile` and dedicated profile components (`src/components/features/profile/*`) that render wallet connection prompts, summaries, and social badges.
- **Leaderboard experience** served by `useLeaderboard` + `useGetCredentials`, with filtering, search, sponsor/timeframe switching, pagination, and token-aware reward totals.
- **Utility helpers** for formatting (numbers, addresses) in `src/components/lib/utils.ts`.
- **Auto commit script** (`npm run auto-commit`) to stage/commit repo changes every 30 seconds when the repo has pending edits.

## Getting Started

```bash
# install dependencies
npm install

# run the dev server
npm run dev

# build for production
npm run build

# run the auto-commit helper (optional)
npm run auto-commit
```

Create an `.env.local` (or equivalent) with the required API keys:

```bash
VITE_PROJECT_ID=<walletconnect_project_id>
VITE_API_KEY=<talent_protocol_api_token>
VITE_BASE_URL=https://api.talentprotocol.com
```

## Project Structure Highlights

- `src/main.tsx` – Application entry point with `AppKitProvider` + `QueryClientProvider`.
- `src/Provider.tsx` – Declares WalletConnect adapter, Wagmi config, and React Query client.
- `src/components/features/profile/*` – Home profile UI: connection prompts, summary cards, identity chips.
- `src/hooks/useTalentProfile.ts` / `useGetCredentials.ts` – TanStack Query hooks for Talent Protocol data.
- `src/page/leaderboard.tsx` – Leaderboard page with filters, search, pagination, and token-aware rewards.
- `src/components/features/leaderboard/*` – Leaderboard components (table, filters, pagination, top cards).

## Tooling

- **Vite** for fast HMR and production builds.
- **TypeScript** for type safety.
- **Tailwind CSS** (via `@tailwindcss/vite`) for styling.
- **TanStack Query** for data fetching and caching.
- **ESLint** for linting (`npm run lint`).

## Contributing

1. Fork the repo and create a new branch.
2. Make your changes and add/update tests where relevant.
3. Run `npm run lint` and `npm run build` before submitting.
4. Open a PR with a clear description of your changes.

## License

MIT © Builders Position
