const DEFAULT_TRUNCATE_CHARS = 4;

export function truncateAddress(
  address?: string,
  chars: number = DEFAULT_TRUNCATE_CHARS
) {
  if (!address) {
    return "";
  }

  if (address.length <= chars * 2 + 2) {
    return address;
  }

  const start = address.slice(0, chars + 2); // include 0x
  const end = address.slice(-chars);

  return `${start}…${end}`;
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatNumber(value?: number | string | null) {
  if (value === undefined || value === null) {
    return "0";
  }

  const numeric = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numeric)) {
    return "0";
  }

  if (Math.abs(numeric) >= 1_000_000_000) {
    return `${numberFormatter.format(numeric / 1_000_000_000)}B`;
  }

  if (Math.abs(numeric) >= 1_000_000) {
    return `${numberFormatter.format(numeric / 1_000_000)}M`;
  }

  if (Math.abs(numeric) >= 1_000) {
    return `${numberFormatter.format(numeric / 1_000)}K`;
  }

  return numberFormatter.format(numeric);
}
