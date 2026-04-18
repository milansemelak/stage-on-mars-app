import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play the future. Then decide it. | Stage on Mars",
  description:
    "Stage on Mars — experiential facilitation built on Systemic Play. Stage, The Question Club, and Space. We move what your organization can't.",
  openGraph: {
    title: "Play the future. Then decide it.",
    description:
      "Stage, The Question Club, and Space. We move what your organization can't.",
    url: "https://playbook.stageonmars.com/business3",
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
    title: "Play the future. Then decide it.",
    description:
      "Stage, The Question Club, and Space. We move what your organization can't.",
    images: ["/og-image.png"],
  },
};

export default function Business3Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
