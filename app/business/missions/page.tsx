"use client";

import { useState } from "react";
import Link from "next/link";

export default function MissionsPage() {
  const [company, setCompany] = useState("");
  const [question, setQuestion] = useState("");
  const [date, setDate] = useState("");
  const [groupSize, setGroupSize] = useState("15-25");
  const [location, setLocation] = useState("Flagship stage");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [generatingMessage, setGeneratingMessage] = useState(false);
  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [missionCode, setMissionCode] = useState("");
  const [copied, setCopied] = useState(false);

  async function generateWelcome() {
    if (!question.trim() || !company.trim()) return;
    setGeneratingMessage(true);
    try {
      const res = await fetch("/api/generate-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, question }),
      });
      const data = await res.json();
      if (data.response) {
        setWelcomeMessage(data.response);
      }
    } catch {
      // silently fail
    }
    setGeneratingMessage(false);
  }

  async function handleCreate() {
    if (!company.trim() || !question.trim() || !date || !hostName.trim() || !hostEmail.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          question,
          date,
          group_size: groupSize,
          location,
          venue: location,
          welcome_message: welcomeMessage,
          spotify_url: "https://open.spotify.com/playlist/33g5Ukkzcd2bUbvkKMMxr2",
          rules: "",
          host_name: hostName,
          host_email: hostEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMissionCode(data.code);
      }
    } catch {
      // silently fail
    }
    setCreating(false);
  }

  function reset() {
    setCompany("");
    setQuestion("");
    setDate("");
    setGroupSize("15-25");
    setLocation("Flagship stage");
    setWelcomeMessage("");
    setHostName("");
    setHostEmail("");
    setMissionCode("");
    setCopied(false);
  }

  const inputClass = "w-full rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-mars/30 px-4 py-3 text-[13px] text-white placeholder:text-white/25 focus:outline-none transition-colors";
  const labelClass = "text-white/30 text-[10px] uppercase tracking-[0.2em] mb-1.5 block";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#EDEDED]">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.04]">
        <Link href="/business">
          <img src="/logo.png" alt="Stage On Mars" className="h-7 sm:h-8 w-auto invert opacity-70 hover:opacity-100 transition-opacity" />
        </Link>
        <span className="text-white/20 text-[10px] uppercase tracking-[0.3em]">Internal</span>
      </nav>

      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <p className="text-mars/50 text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-bold mb-3">Mission Control</p>
            <h1 className="text-[24px] sm:text-[32px] font-bold tracking-[-0.03em]">Generate Crew Invitation</h1>
          </div>

          {!missionCode ? (
            <div className="rounded-2xl border border-mars/20 bg-mars/[0.04] overflow-hidden">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
              <div className="px-6 sm:px-8 py-6 sm:py-8 space-y-4">

                {/* Client info */}
                <p className="text-mars/40 text-[10px] uppercase tracking-[0.3em] font-bold">Client</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className={labelClass}>Company</label>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" className={inputClass} />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Meta-question</label>
                  <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What question will the crew play with?" rows={2} className={`${inputClass} resize-none`} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className={labelClass}>Group size</label>
                    <select value={groupSize} onChange={(e) => setGroupSize(e.target.value)} className={inputClass}>
                      <option value="8-15">8-15 (Intimate)</option>
                      <option value="15-25">15-25 (Team)</option>
                      <option value="25-50">25-50 (Large group)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Location</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass}>
                      <option value="Flagship stage">Flagship stage</option>
                      <option value="Your office">Client office</option>
                      <option value="Special location">Special location</option>
                    </select>
                  </div>
                </div>

                {/* Host */}
                <div className="pt-2">
                  <p className="text-mars/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Host</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className={labelClass}>Name</label>
                      <input value={hostName} onChange={(e) => setHostName(e.target.value)} placeholder="Milan" className={inputClass} />
                    </div>
                    <div className="flex-1">
                      <label className={labelClass}>Email</label>
                      <input type="email" value={hostEmail} onChange={(e) => setHostEmail(e.target.value)} placeholder="play@stageonmars.com" className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Welcome message */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-white/30 text-[10px] uppercase tracking-[0.2em]">Welcome message</label>
                    <button
                      type="button"
                      onClick={generateWelcome}
                      disabled={generatingMessage || !question.trim() || !company.trim()}
                      className={`text-[10px] uppercase tracking-[0.15em] font-bold transition-colors ${
                        generatingMessage || !question.trim() || !company.trim()
                          ? "text-white/15 cursor-not-allowed"
                          : "text-mars/50 hover:text-mars"
                      }`}
                    >
                      {generatingMessage ? "Generating..." : "Generate with AI"}
                    </button>
                  </div>
                  <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} placeholder="Invitation to play..." rows={5} className={`${inputClass} resize-none`} />
                </div>

                <button
                  onClick={handleCreate}
                  disabled={creating || !company.trim() || !question.trim() || !date || !hostName.trim() || !hostEmail.trim()}
                  className={`w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-[0.15em] transition-all mt-2 ${
                    !creating && company.trim() && question.trim() && date && hostName.trim() && hostEmail.trim()
                      ? "bg-mars hover:bg-mars-light text-white shadow-[0_4px_20px_-4px_rgba(255,85,0,0.3)]"
                      : "bg-white/[0.06] text-white/25 cursor-not-allowed"
                  }`}
                >
                  {creating ? "Generating..." : "Generate Mission"}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-mars/20 bg-mars/[0.04] overflow-hidden">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-mars/30 to-transparent" />
              <div className="px-6 sm:px-8 py-8 sm:py-10">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-full bg-mars/20 border border-mars/30 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-mars" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  <p className="text-white/80 text-[18px] sm:text-[22px] font-bold mb-1">
                    {company} <span className="font-mercure italic text-mars">on Mars</span>
                  </p>
                  <p className="text-white/30 text-[12px]">Mission created</p>
                </div>

                <p className="text-mars/50 text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Crew invitation link</p>
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-center gap-3 mb-4">
                  <p className="flex-1 text-white/60 text-[12px] sm:text-[13px] font-mono truncate">
                    {typeof window !== "undefined" ? window.location.origin : ""}/business/mission/{missionCode}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/business/mission/${missionCode}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="shrink-0 px-4 py-2 rounded-lg bg-mars/20 hover:bg-mars/30 text-mars text-[11px] font-bold uppercase tracking-[0.1em] transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`/business/mission/${missionCode}`}
                    target="_blank"
                    className="flex-1 py-3 rounded-xl border border-white/[0.1] text-center text-white/50 text-[12px] font-bold uppercase tracking-[0.1em] hover:border-white/20 hover:text-white/70 transition-all"
                  >
                    Preview
                  </a>
                  <button
                    onClick={reset}
                    className="flex-1 py-3 rounded-xl border border-mars/20 text-center text-mars/60 text-[12px] font-bold uppercase tracking-[0.1em] hover:border-mars/40 hover:text-mars transition-all"
                  >
                    New Mission
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
