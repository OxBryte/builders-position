import type { FC } from "react";

type ConnectWalletPromptProps = {
  onConnect: () => void;
};

const ConnectWalletPrompt: FC<ConnectWalletPromptProps> = ({ onConnect }) => {
  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-6 text-sm shadow-sm">
      <div className="flex flex-col items-center gap-3 text-center text-blue-700">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500 shadow-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 00-2.25-2.25h-4.5A2.25 2.25 0 0012 12v.75m9 0v.75a2.25 2.25 0 01-2.25 2.25h-4.5A2.25 2.25 0 0112 12.75v-.75m9 0V9a2.25 2.25 0 00-2.25-2.25h-4.5A2.25 2.25 0 0012 9v1.5m0 0h-1.5m1.5 0h1.5M6.75 15.75h.008v.008H6.75v-.008zM6.75 12h.008v.008H6.75V12zm0-3.75h.008v.008H6.75V8.25z"
            />
          </svg>
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-blue-900">Connect your wallet</h2>
          <p className="text-sm text-blue-700/80">
            Link your wallet to view personalized Talent Protocol insights and track your
            builder stats.
          </p>
        </div>
        <button
          type="button"
          onClick={onConnect}
          className="rounded-full border border-blue-500 bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-100"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default ConnectWalletPrompt;
