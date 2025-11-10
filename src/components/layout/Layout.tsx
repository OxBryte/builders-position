import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const outerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
};

const innerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "960px",
  padding: "0 24px",
};

function Layout({ children }: LayoutProps) {
  return (
    <div style={outerStyle}>
      <div style={innerStyle}>{children}</div>
    </div>
  );
}

export default Layout;
