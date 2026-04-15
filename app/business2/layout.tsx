import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stage on Mars — Play the future. Then create it.",
  description: "Your team's real question, played out on stage. In four hours, the room gets unstuck. 800+ plays with Forbes, Škoda, PwC, YPO, Oktagon, House of Lobkowicz.",
  openGraph: {
    title: "Stage on Mars — Play the future. Then create it.",
    description: "Your team's real question, played out on stage. In four hours, the room gets unstuck.",
    url: "https://playbook.stageonmars.com/business2",
    siteName: "Stage on Mars",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stage on Mars — Play the future.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stage on Mars — Play the future. Then create it.",
    description: "Your team's real question, played out on stage. In four hours, the room gets unstuck.",
    images: ["/og-image.png"],
  },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
