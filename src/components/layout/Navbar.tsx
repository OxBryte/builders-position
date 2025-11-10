import { NavLink } from "react-router-dom";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { truncateAddress } from "../lib/utils";

export default function Navbar() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <div className="bg-white border border-gray-200">
      <nav className="flex items-center justify-between gap-6 py-4 mx-auto w-full max-w-[920px] px-6">
        <span className="text-lg font-semibold tracking-wide text-gray-900">
          Builders Position
        </span>

        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              [
                "transition-colors",
                isActive ? "text-blue-600" : "hover:text-gray-700",
              ].join(" ")
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              [
                "transition-colors",
                isActive ? "text-blue-600" : "hover:text-gray-700",
              ].join(" ")
            }
          >
            Leaderboard
          </NavLink>
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
        </div>
      </nav>
    </div>
  );
}
