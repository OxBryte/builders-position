export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4">
      <span className="text-xl font-semibold tracking-wide">Your Logo</span>
      <button
        className="rounded-full border border-blue-500 bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-500"
        type="button"
      >
        Connect Wallet
      </button>
    </nav>
  );
}
