import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AuthGate from "@/components/AuthGate";
import { I18nProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stage on Mars — The Playmaker",
  description:
    "Transform questions into Systemic Plays. An experiential method that expands perspective through collective creativity.",
  metadataBase: new URL("https://playbook.stageonmars.com"),
  openGraph: {
    title: "Stage on Mars — The Playmaker",
    description:
      "Turn your question into a systemic play to see what you can't see alone.",
    siteName: "Stage on Mars",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stage on Mars — The Playmaker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stage on Mars — The Playmaker",
    description:
      "Turn your question into a systemic play to see what you can't see alone.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white min-h-screen`}
      >
        <I18nProvider>
          <AuthGate>
            <Header />
            <main>{children}</main>
          </AuthGate>
        </I18nProvider>
      </body>
    </html>
  );
}
