export { default } from "./home";
import { useMemo } from "react";
import { useAppKitAccount } from "@reown/appkit/react";

import { truncateAddress, formatNumber } from "../components/lib/utils";
import { useTalentProfile } from "../hooks/useTalentProfile";

function getInitials(value?: string | null) {
  if (!value) return "BP";
  const parts = value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase());

  if (parts.length === 0) {
    return value.slice(0, 2).toUpperCase();
  }

  return parts.slice(0, 2).join("");
}

function asNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export default function Home() {
  const { address, isConnected } = useAppKitAccount();
  const {
    data: profile,
    isLoading,
    error,
    tokenAvailable,
    refetch,
    isRefetching,
  } = useTalentProfile(address ?? undefined);

  const displayName = useMemo(() => {
    return (
      profile?.display_name ??
      profile?.name ??
      profile?.username ??
      "Connected Builder"
    );
  }, [profile]);

  const avatarUrl =
    profile?.profile_picture_url ??
    (profile?.profile_picture_data &&
      typeof profile.profile_picture_data === "object" &&
      "url" in profile.profile_picture_data
      ? (profile.profile_picture_data as { url?: string }).url
      : undefined);

  const headline = profile?.headline ?? profile?.summary ?? "";
  const bio = profile?.bio ?? profile?.about ?? "";
  const location = profile?.location ?? profile?.country;

  const supporters =
    profile?.talent?.supporters_count ??
    profile?.stats?.supporters ??
    profile?.supporters_count ??
    profile?.total_supporters ??
    0;

  const totalSupportVolume = asNumber(
    profile?.stats?.total_support_volume ?? profile?.talent?.total_support_volume,
  );

  const talentTokenPrice = asNumber(
    profile?.stats?.talent_token_price ?? profile?.talent?.price,
  );

  const walletLabel = address ? truncateAddress(address) : "";

  const hasProfile = Boolean(profile);

  return (
    <section className="mt-8 space-y-6">
      {!isConnected ? (
        <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/60 p-6 text-center text-sm text-blue-700">
          Connect your wallet to view your Talent Protocol profile summary.
        </div>
      ) : !tokenAvailable ? (
        <div className="rounded-2xl border border-yellow-300 bg-yellow-50/70 p-6 text-center text-sm text-yellow-800">
          Talent Protocol API token missing. Add <code>VITE_TALENT_API_TOKEN</code> to
          your environment configuration and restart the dev server.
        </div>
      ) : isLoading || isRefetching ? (
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 text-sm text-gray-600">
          Loading profile…
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50/70 p-6 text-sm text-red-700">
          <p>We couldn&apos;t load your profile: {error.message}</p>
          <button
            type="button"
            className="rounded-full border border-red-300 px-4 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
            onClick={() => refetch()}
          >
            Try again
          </button>
        </div>
      ) : !hasProfile ? (
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 text-center text-sm text-gray-600">
          No Talent Protocol profile found for this address yet.
        </div>
      ) : (
        <div className="space-y-6 rounded-3xl border border-blue-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-blue-100 bg-blue-50">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-blue-600">
                  {getInitials(displayName)}
                </span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {displayName}
                  </h1>
                  {headline ? (
                    <p className="text-sm text-gray-600">{headline}</p>
                  ) : null}
                </div>
                {walletLabel ? (
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                    {walletLabel}
                  </span>
                ) : null}
              </div>
              {location ? (
                <p className="text-sm text-gray-500">
                  Location: <span className="font-medium">{location}</span>
                </p>
              ) : null}
              {bio ? (
                <p className="text-sm leading-relaxed text-gray-700">{bio}</p>
              ) : (
                <p className="text-sm text-gray-500">
                  No bio provided yet. Update your Talent Protocol profile to add more
                  details.
                </p>
              )}
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-blue-700">
                Supporters
              </dt>
              <dd className="mt-2 text-xl font-semibold text-blue-900">
                {formatNumber(supporters)}
              </dd>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-indigo-700">
                Token Price
              </dt>
              <dd className="mt-2 text-xl font-semibold text-indigo-900">
                {talentTokenPrice > 0 ? `$${formatNumber(talentTokenPrice)}` : "—"}
              </dd>
            </div>
            <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-teal-700">
                Support Volume
              </dt>
              <dd className="mt-2 text-xl font-semibold text-teal-900">
                {totalSupportVolume > 0 ? formatNumber(totalSupportVolume) : "—"}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
