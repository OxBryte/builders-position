import { NavLink } from "react-router-dom";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { truncateAddress } from "../lib/utils";

export default function Navbar() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <nav className="flex items-center justify-between gap-6 py-4">
      <div className="flex flex-1 flex-wrap items-center gap-4 sm:gap-6">
        <span className="text-lg font-semibold tracking-wide">
          Builders Position
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm font-medium text-gray-500"></div>
      {isConnected ? (
        <div
          className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm"
          onClick={() => open()}
        >
          <span className="text-sm">{truncateAddress(address)}</span>
        </div>
      ) : (
        <button
          className="rounded-full border border-blue-500 bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          type="button"
          onClick={() => open()}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
}
