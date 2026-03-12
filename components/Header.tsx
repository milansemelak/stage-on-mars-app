"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Stage On Mars"
            width={200}
            height={50}
            className="h-[60px] md:h-[120px] w-auto invert"
            priority
          />
        </Link>
        <nav className="flex items-center gap-6">
          <a
            href="https://www.stageonmars.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            The Human Future Simulator
          </a>
        </nav>
      </div>
    </header>
  );
}
