import type { ReactNode } from "react";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen pb-10">
      <div className="mx-auto w-full max-w-[860px] px-6">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default Layout;
