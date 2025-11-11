import type { FC } from "react";

import { truncateAddress } from "../../lib/utils";
import type { TalentAccount } from "../../../hooks/useTalentProfile";

const getInitials = (value?: string | null) => {
  if (!value) return "BP";
  const parts = value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase());

  if (parts.length === 0) {
    return value.slice(0, 2).toUpperCase();
  }

  return parts.slice(0, 2).join("");
};

type IdentityChip = {
  icon: string;
  label: string;
};

type ProfileContentProps = {
  profile: TalentAccount;
  walletAddress?: string;
};

const ProfileContent: FC<ProfileContentProps> = ({
  profile,
  walletAddress,
}) => {
  const displayName =
    profile.display_name ??
    profile.name ??
    profile.username ??
    "Connected Builder";

  const avatarUrl = profile.image_url ?? undefined;

  const bio = profile.bio ?? profile.about ?? "";
  const location = profile.location ?? profile.country ?? "";
  const ens = profile.ens ?? "";
  const username = profile.name ?? "";
  const isVerified = Boolean(
    profile.human_checkmark || profile.user?.human_checkmark
  );

  const primaryWalletAddress =
    profile.main_wallet_address ??
    profile.user?.main_wallet ??
    walletAddress ??
    "";

  const accounts = profile.accounts ?? [];
  const farcasterHandle =
    accounts.find((account) => account.source === "farcaster")?.username ?? "";
  const githubHandle =
    accounts.find((account) => account.source === "github")?.username ?? "";
  const linkedinHandle =
    accounts.find((account) => account.source === "linkedin")?.username ?? "";

  const identityChips: IdentityChip[] = [];

  if (location) identityChips.push({ icon: "📍", label: location });
  if (ens) identityChips.push({ icon: "🪪", label: ens });
  if (username) identityChips.push({ icon: "👤", label: `@${username}` });
  if (farcasterHandle)
    identityChips.push({ icon: "✦", label: `fc/${farcasterHandle}` });
  if (githubHandle)
    identityChips.push({ icon: "⌘", label: `gh/${githubHandle}` });
  if (linkedinHandle) identityChips.push({ icon: "in", label: linkedinHandle });
  if (primaryWalletAddress) {
    identityChips.push({
      icon: "🔐",
      label: truncateAddress(primaryWalletAddress),
    });
  }

  return (
    <div className="space-y-6 rounded-3xl border border-blue-100 bg-[var(--card-bg)] p-6 shadow-md backdrop-blur-sm">
      <ProfileHeader
        displayName={displayName}
        bio={bio}
        avatarUrl={avatarUrl}
        isVerified={isVerified}
        chips={identityChips}
      />
      <ProfileSummaryCard summary={profile.summary} />
    </div>
  );
};

type ProfileHeaderProps = {
  displayName: string;
  bio?: string | null;
  avatarUrl?: string;
  isVerified?: boolean;
  chips: IdentityChip[];
};

const ProfileHeader: FC<ProfileHeaderProps> = ({
  displayName,
  bio,
  avatarUrl,
  isVerified,
  chips,
}) => {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-inner">
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
        {isVerified ? (
          <span className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 z-1 items-center justify-center rounded-full bg-blue-600 text-white shadow ring-2 ring-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        ) : null}
      </div>

      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              {displayName}
            </h1>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                Verified Builder
              </span>
            ) : null}
          </div>
          {bio ? (
            <p className="max-w-2xl text-sm leading-relaxed text-gray-700">
              {bio}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              No bio provided yet. Update your Talent Protocol profile to add
              more details.
            </p>
          )}
        </div>

        {chips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={`${chip.icon}-${chip.label}`}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm"
              >
                <span>{chip.icon}</span>
                {chip.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

type ProfileSummaryCardProps = {
  summary?: string | null;
};

const ProfileSummaryCard: FC<ProfileSummaryCardProps> = ({ summary }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 text-sm text-gray-600 shadow-inner">
      <p>
        <span className="font-medium text-gray-800">Latest summary: </span>
        {summary ?? "No summary provided yet."}
      </p>
    </div>
  );
};

export default ProfileContent;
