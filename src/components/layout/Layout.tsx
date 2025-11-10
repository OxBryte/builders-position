import type { ReactNode } from "react";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[960px] px-6">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default Layout;
