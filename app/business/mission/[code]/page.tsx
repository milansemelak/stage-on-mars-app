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
    title: mission ? `${mission.company} on Mars` : "Mission Not Found",
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
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-[20px] font-bold mb-2">Mission not found.</p>
          <Link href="/business" className="text-mars text-[14px] font-bold hover:underline">
            Go home
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
      <BoardingPass mission={mission as Mission} initialCrew={crewList} />
    </MissionGate>
  );
}
