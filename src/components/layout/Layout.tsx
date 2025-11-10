import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[960px] px-6">{children}</div>
    </div>
  );
}

export default Layout;
