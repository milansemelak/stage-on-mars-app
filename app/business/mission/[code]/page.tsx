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
      <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED] relative">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-mars/[0.02] blur-[150px] rounded-full" />
        </div>

        {/* Top bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-5 sm:px-8 py-5 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent">
          <Link href="/business">
            <img src="/logo.png" alt="Stage On Mars" className="h-6 sm:h-7 w-auto invert opacity-40 hover:opacity-70 transition-opacity" />
          </Link>
        </nav>

        <div className="relative z-10 pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6">
          <div className="max-w-lg mx-auto">
            <BoardingPass mission={mission as Mission} initialCrew={crewList} />

            {/* Footer */}
            <div className="mt-16 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-6 h-[1px] bg-white/[0.04]" />
                <div className="w-1 h-1 rounded-full bg-mars/15" />
                <div className="w-6 h-[1px] bg-white/[0.04]" />
              </div>
              <p className="text-white/[0.08] text-[10px] tracking-[0.3em] uppercase">
                <a href="mailto:play@stageonmars.com" className="hover:text-white/20 transition-colors">play@stageonmars.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MissionGate>
  );
}
