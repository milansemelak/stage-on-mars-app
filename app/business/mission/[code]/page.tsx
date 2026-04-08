import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import BoardingPass from "@/components/BoardingPass";
import MissionGate from "@/components/MissionGate";
import type { Mission } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createServerSupabase();
  const { data: mission } = await supabase
    .from("missions")
    .select("company")
    .eq("code", code)
    .single();

  return {
    title: mission ? `${mission.company} on Mars — Mission Briefing` : "Mission Not Found",
  };
}

export default async function MissionPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createServerSupabase();

  const { data: mission, error } = await supabase
    .from("missions")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !mission) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] flex items-center justify-center">
        <div className="text-center">
          <p className="text-mars/50 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Mission Not Found</p>
          <p className="text-white/40 text-[14px] mb-6">This mission does not exist or has been archived.</p>
          <Link href="/business" className="text-mars text-[13px] font-bold uppercase tracking-[0.15em] hover:text-mars-light transition-colors">
            Home
          </Link>
        </div>
      </div>
    );
  }

  const { data: crew } = await supabase
    .from("crew_registrations")
    .select("name, question")
    .eq("mission_id", mission.id)
    .order("registered_at", { ascending: true });

  const crewList = (crew || []).map((c: { name: string; question: string | null }) => ({
    name: c.name,
    question: c.question || "",
  }));

  return (
    <MissionGate missionCode={code} hasPassword={!!(mission.password)}>
      <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED]">
        {/* Top bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.04]">
          <Link href="/business">
            <img src="/logo.png" alt="Stage On Mars" className="h-7 sm:h-8 w-auto invert opacity-70 hover:opacity-100 transition-opacity" />
          </Link>
        </nav>

        <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
          <div className="max-w-lg mx-auto">
            {/* Mission header */}
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-bold mb-4">
                Mission Briefing
              </p>
              <h1 className="text-[28px] sm:text-[40px] font-bold tracking-[-0.03em] leading-[1.1] mb-3">
                <span className="text-white">{mission.company}</span>{" "}
                <span className="font-mercure italic text-mars">on Mars</span>
              </h1>
              <p className="text-white/30 text-[13px]">
                {new Date(mission.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                {(mission.location || mission.venue) && ` · ${mission.location || mission.venue}`}
              </p>
            </div>

            <BoardingPass mission={mission as Mission} initialCrew={crewList} />

            {/* Footer */}
            <div className="mt-12 text-center space-y-4">
              <div className="w-12 h-[1px] bg-white/[0.06] mx-auto" />
              <p className="text-white/15 text-[11px]">
                <a href="mailto:play@stageonmars.com" className="hover:text-white/30 transition-colors">play@stageonmars.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MissionGate>
  );
}
