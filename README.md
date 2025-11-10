# Builders Position

Builders Position is a React + TypeScript application bootstrapped with Vite. It integrates WalletConnect’s AppKit, Tailwind CSS utilities, and a BuilderScore leaderboard feed to showcase on-chain builder activity.

## Features

- **WalletConnect AppKit** integration via `@reown/appkit` and `wagmi`, configured for Base and Base Sepolia networks (`src/Provider.tsx`).
- **Responsive layout components** with Tailwind CSS (`src/components/layout/*`), including a 960 px max-width container and a wallet connect navbar wired to `useAppKit`.
- **BuilderScore leaderboard hook** powered by TanStack Query (`src/hooks/useLeaderboard.ts`) with sensible defaults for the WalletConnect sponsor grant.
- **Utility helpers** such as address truncation and number formatting (`src/components/lib/utils.ts`).
- **Auto commit script** (`npm run auto-commit`) to stage and commit repo changes at 30 second intervals.

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

Create a `.env.local` file (or update your environment) with a valid WalletConnect project id:

```bash
VITE_PROJECT_ID=<your_walletconnect_project_id>
```

## Project Structure Highlights

- `src/main.tsx` – App entry point that wraps the tree with `AppKitProvider`.
- `src/Provider.tsx` – Configures WalletConnect AppKit, Wagmi, and React Query providers.
- `src/components/layout` – Layout primitives including the navbar wallet connect button.
- `src/hooks/useLeaderboard.ts` – Fetches BuilderScore leaderboard data with caching.
- `src/page/home.tsx` – Example page demonstrating the leaderboard display.

## Tooling

- **Vite** for fast HMR and builds.
- **TypeScript** with strict configuration.
- **Tailwind CSS** (via `@tailwindcss/vite`) for styling.
- **TanStack Query** for data fetching/caching.
- **ESLint** for linting (`npm run lint`).

## Contributing

1. Fork the repo and create a new branch.
2. Make your changes and update/add tests if needed.
3. Run `npm run lint` and `npm run build` to ensure everything passes.
4. Submit a pull request with a clear description of the changes.

## License

MIT © Builders Position
