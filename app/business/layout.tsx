import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play the future. Then decide it. | Stage on Mars",
  description: "Turn real questions into plays. Play to see beyond current reality — live on stage or digitally. Stage on Mars.",
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
