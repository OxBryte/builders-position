import type { FC } from "react";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

const ErrorState: FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50/70 p-6 text-sm text-red-700">
      <p>We couldn&apos;t load your profile: {message}</p>
      <button
        type="button"
        className="rounded-full border border-red-300 px-4 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorState;
