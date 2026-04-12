import { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase-server";
import SharedPlayClient from "./SharedPlayClient";

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;

  try {
    const supabase = await createServerSupabase();
    const { data: sharedPlay } = await supabase
      .from("shared_plays")
      .select("play_data, question, client_name")
      .eq("code", code)
      .single();

    if (!sharedPlay) {
      return { title: "Play Not Found — Stage on Mars" };
    }

    const play = sharedPlay.play_data as { name: string; characters?: { name: string }[] };
    const question = sharedPlay.question as string;
    const clientName = sharedPlay.client_name as string;
    const characterNames = play.characters?.map((c) => c.name).join(", ") || "";

    const title = `${play.name} — Stage on Mars`;
    const description = clientName
      ? `"${question}" — a play with ${characterNames}. Created by ${clientName}.`
      : `"${question}" — a play with ${characterNames}.`;

    return {
      title,
      description,
      openGraph: {
        title: play.name,
        description,
        siteName: "Stage on Mars",
        type: "article",
        images: [
          {
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: `${play.name} — Stage on Mars`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: play.name,
        description,
      },
    };
  } catch {
    return { title: "Stage on Mars — The Play Simulator" };
  }
}

export default async function SharedPlayPage({ params }: Props) {
  const { code } = await params;
  return <SharedPlayClient code={code} />;
}
