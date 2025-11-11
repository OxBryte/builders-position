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

type ProfileContentProps = {
  profile: TalentAccount;
  walletAddress?: string;
};

const ProfileContent: FC<ProfileContentProps> = ({
  profile,
  walletAddress,
}) => {
  const displayName =
    profile.display_name ?? profile.username ?? "Connected Builder";
  const avatarUrl = profile.image_url ?? undefined;
  const bio = profile.bio ?? "";
  const location = profile.location ?? "";
  const ens = profile.ens ?? "";
  const username = profile.name ?? "";

  const walletLabel = walletAddress ? truncateAddress(walletAddress) : "";

  return (
    <div className="space-y-6 rounded-3xl border border-blue-100 bg-[var(--card-bg)] p-6 shadow-md backdrop-blur-sm">
      <ProfileHeader
        displayName={displayName}
        location={location}
        bio={bio}
        avatarUrl={avatarUrl}
        walletLabel={walletLabel}
        ens={ens}
        username={username}
      />
      <ProfileSummaryCard summary={profile.summary} />
    </div>
  );
};

type ProfileHeaderProps = {
  displayName: string;
  location?: string | null;
  bio?: string | null;
  avatarUrl?: string;
  walletLabel?: string;
  ens?: string;
  username?: string;
};

const ProfileHeader: FC<ProfileHeaderProps> = ({
  displayName,
  location,
  bio,
  avatarUrl,
  username,
  walletLabel,
  ens,
}) => {
  return (
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
            {ens ? <p className="text-sm text-gray-600">{ens}</p> : null}
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
