import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { truncateAddress } from "../lib/utils";

export default function Navbar() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <nav className="flex items-center justify-between py-4">
      <span className="text-xl font-semibold tracking-wide">Your Logo</span>
      {isConnected ? (
        <div
          className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm"
          onClick={() => open()}
        >
          <span>{truncateAddress(address)}</span>
        </div>
      ) : (
        <button
          className="rounded-full border border-blue-500 bg-blue-600 px-4 py-2 font-semibold text-sm text-white transition hover:bg-blue-500"
          type="button"
          onClick={() => open()}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
}
