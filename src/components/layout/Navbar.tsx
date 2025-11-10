import type { CSSProperties } from "react";

const navStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 0",
};

const logoStyle: CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 600,
  letterSpacing: "0.02em",
};

const buttonStyle: CSSProperties = {
  padding: "0.5rem 1.25rem",
  borderRadius: "999px",
  border: "1px solid #3b82f6",
  background: "#1d4ed8",
  color: "#ffffff",
  fontWeight: 600,
  cursor: "pointer",
};

function Navbar() {
  return (
    <nav style={navStyle}>
      <span style={logoStyle}>Your Logo</span>
      <button style={buttonStyle} type="button">
        Connect Wallet
      </button>
    </nav>
  );
}

export default Navbar;
