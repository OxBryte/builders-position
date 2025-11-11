import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

import ConnectWalletPrompt from "../components/features/profile/ConnectWalletPrompt";
import MissingTokenAlert from "../components/features/profile/MissingTokenAlert";
import LoadingState from "../components/features/profile/LoadingState";
import ErrorState from "../components/features/profile/ErrorState";
import EmptyProfileState from "../components/features/profile/EmptyProfileState";
import ProfileContent from "../components/features/profile/ProfileContent";
import { useTalentProfile } from "../hooks/useTalentProfile";

export default function Home() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const {
    profile,
    profileError,
    isLoadingProfile,
    isFetchingProfile,
    refetchProfile,
    tokenAvailable,
  } = useTalentProfile(address ?? undefined);

  if (!isConnected) {
    return (
      <section className="mt-8 space-y-6">
        <ConnectWalletPrompt onConnect={open} />
      </section>
    );
  }

  if (!tokenAvailable) {
    return (
      <section className="mt-8 space-y-6">
        <MissingTokenAlert />
      </section>
    );
  }

  if (isLoadingProfile || isFetchingProfile) {
    return (
      <section className="mt-8 space-y-6">
        <LoadingState />
      </section>
    );
  }

  if (profileError) {
    return (
      <section className="mt-8 space-y-6">
        <ErrorState message={profileError.message} onRetry={refetchProfile} />
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="mt-8 space-y-6">
        <EmptyProfileState />
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <ProfileContent profile={profile} walletAddress={address} />
    </section>
  );
}
