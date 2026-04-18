"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/business3/stage", label: "Stage" },
  { href: "/business3/club", label: "The Question Club" },
  { href: "/business3/space", label: "Space" },
  { href: "/business3/codex", label: "Codex" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 bg-black/40 backdrop-blur-md border-b border-white/[0.06]">
      <Link href="/business3" aria-label="Stage on Mars — home">
        <img
          src="/logo.png"
          alt="Stage On Mars"
          className="h-7 sm:h-8 w-auto invert opacity-80 hover:opacity-100 transition-opacity"
        />
      </Link>
      <ul className="hidden md:flex items-center gap-7 text-[12px] uppercase tracking-[0.18em]">
        {ITEMS.map((it) => {
          const active = pathname === it.href || pathname?.startsWith(it.href + "/");
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`transition-colors ${active ? "text-mars" : "text-white/60 hover:text-white"}`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href="/business3/club"
        className="md:hidden text-[11px] uppercase tracking-[0.18em] text-mars"
      >
        Play a question
      </Link>
    </nav>
  );
}
