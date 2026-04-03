import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reality Play Platform | Stage on Mars",
  description: "Play to see beyond current reality. Turn real questions into plays — live on stage or digitally. Stage on Mars.",
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
