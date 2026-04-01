"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const STANDALONE_ROUTES = ["/business"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some((r) => pathname.startsWith(r));

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/[0.04] py-6 text-center text-white/15 text-xs">
        &copy; {new Date().getFullYear()} Stage on Mars. All rights reserved.
      </footer>
    </>
  );
}
