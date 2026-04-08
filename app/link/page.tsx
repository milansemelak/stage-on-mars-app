import Link from "next/link";

export const metadata = {
  title: "Stage on Mars — Links",
};

const links = [
  {
    title: "The Play Simulator",
    description: "Experience systemic play online.",
    href: "/play",
  },
  {
    title: "The New Website",
    description: "Everything about Stage on Mars.",
    href: "/business",
  },
  {
    title: "Invitations to Play",
    description: "Create mission landing pages for your crew.",
    href: "/business/missions",
  },
];

export default function LinkPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Stage on Mars"
          className="h-10 sm:h-12 w-auto mx-auto mb-10"
        />

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="block w-full rounded-2xl bg-black text-white px-6 py-5 text-left hover:bg-neutral-900 active:scale-[0.99] transition-all"
            >
              <p className="text-[16px] font-bold tracking-[-0.02em]">{link.title}</p>
              <p className="text-white/40 text-[13px] mt-0.5">{link.description}</p>
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10">
          <a href="mailto:play@stageonmars.com" className="text-neutral-400 text-[13px] hover:text-black transition-colors">
            play@stageonmars.com
          </a>
        </div>
      </div>
    </div>
  );
}
