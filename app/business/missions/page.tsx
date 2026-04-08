"use client";

import { useState } from "react";
import Link from "next/link";

export default function MissionsPage() {
  const [company, setCompany] = useState("");
  const [question, setQuestion] = useState("");
  const [date, setDate] = useState("");
  const [groupSize, setGroupSize] = useState("15-25");
  const [location, setLocation] = useState("Stage on Mars Flagship Space");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [generatingMessage, setGeneratingMessage] = useState(false);
  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [time, setTime] = useState("");
  const [captain, setCaptain] = useState("");
  const [facilitator, setFacilitator] = useState("");
  const [dresscode, setDresscode] = useState("Dress to Play");
  const [mapsUrl, setMapsUrl] = useState("");
  const [password, setPassword] = useState("");
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
          time,
          captain,
          facilitator,
          dresscode,
          maps_url: mapsUrl,
          password,
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
    setTime("");
    setCaptain("");
    setFacilitator("");
    setDresscode("Dress to Play");
    setMapsUrl("");
    setPassword("");
    setMissionCode("");
    setCopied(false);
  }

  const inputClass = "w-full rounded-lg border border-neutral-300 px-4 py-3 text-[14px] text-black placeholder:text-neutral-400 focus:outline-none focus:border-mars transition-colors bg-white";
  const labelClass = "text-neutral-500 text-[11px] uppercase tracking-[0.15em] font-medium mb-1 block";

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <Link href="/business">
          <img src="/logo.png" alt="Stage On Mars" className="h-7 sm:h-8 w-auto opacity-70 hover:opacity-100 transition-opacity" />
        </Link>
        <span className="text-neutral-300 text-[10px] uppercase tracking-[0.3em] font-bold">Internal</span>
      </nav>

      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-5 sm:px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <p className="text-mars text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-bold mb-2">Mission Control</p>
            <h1 className="text-[24px] sm:text-[32px] font-bold tracking-[-0.03em] text-black">Generate Crew Invitation</h1>
          </div>

          {!missionCode ? (
            <div className="space-y-6">

              {/* Client info */}
              <div className="rounded-2xl border border-neutral-200 px-5 sm:px-7 py-5 sm:py-6 space-y-4">
                <p className="text-mars text-[10px] uppercase tracking-[0.25em] font-bold">Client</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Company</label>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Meta-question</label>
                  <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What question will the crew play with?" rows={2} className={`${inputClass} resize-none`} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Group size</label>
                    <select value={groupSize} onChange={(e) => setGroupSize(e.target.value)} className={inputClass}>
                      <option value="8-15">8-15 (Intimate)</option>
                      <option value="15-25">15-25 (Team)</option>
                      <option value="25-50">25-50 (Large group)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass}>
                      <option value="Stage on Mars Flagship Space">Stage on Mars Flagship Space</option>
                      <option value="Your office">Client office</option>
                      <option value="Special location">Special location</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Event details */}
              <div className="rounded-2xl border border-neutral-200 px-5 sm:px-7 py-5 sm:py-6 space-y-4">
                <p className="text-mars text-[10px] uppercase tracking-[0.25em] font-bold">Event Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Time</label>
                    <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="9:30 - 12:00" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Dresscode</label>
                    <input value={dresscode} onChange={(e) => setDresscode(e.target.value)} placeholder="Dress to Play" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Google Maps URL</label>
                    <input value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} placeholder="https://maps.google.com/..." className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Password (optional)</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave empty for open access" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Captain</label>
                    <input value={captain} onChange={(e) => setCaptain(e.target.value)} placeholder="Captain name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Pilot</label>
                    <input value={facilitator} onChange={(e) => setFacilitator(e.target.value)} placeholder="Pilot name" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Host */}
              <div className="rounded-2xl border border-neutral-200 px-5 sm:px-7 py-5 sm:py-6 space-y-4">
                <p className="text-mars text-[10px] uppercase tracking-[0.25em] font-bold">Host</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input value={hostName} onChange={(e) => setHostName(e.target.value)} placeholder="Milan" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" value={hostEmail} onChange={(e) => setHostEmail(e.target.value)} placeholder="play@stageonmars.com" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Welcome message */}
              <div className="rounded-2xl border border-neutral-200 px-5 sm:px-7 py-5 sm:py-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-mars text-[10px] uppercase tracking-[0.25em] font-bold">Welcome Message</p>
                  <button
                    type="button"
                    onClick={generateWelcome}
                    disabled={generatingMessage || !question.trim() || !company.trim()}
                    className={`text-[11px] uppercase tracking-[0.1em] font-bold transition-colors ${
                      generatingMessage || !question.trim() || !company.trim()
                        ? "text-neutral-300 cursor-not-allowed"
                        : "text-mars hover:text-mars-light"
                    }`}
                  >
                    {generatingMessage ? "Generating..." : "Generate with AI ✦"}
                  </button>
                </div>
                <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} placeholder="Write an invitation to play..." rows={5} className={`${inputClass} resize-none`} />
              </div>

              <button
                onClick={handleCreate}
                disabled={creating || !company.trim() || !question.trim() || !date || !hostName.trim() || !hostEmail.trim()}
                className={`w-full py-4 rounded-xl font-bold text-[14px] uppercase tracking-[0.12em] transition-all ${
                  !creating && company.trim() && question.trim() && date && hostName.trim() && hostEmail.trim()
                    ? "bg-mars hover:bg-mars-light text-white active:scale-[0.99]"
                    : "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                }`}
              >
                {creating ? "Generating..." : "Generate Mission"}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="bg-black px-6 sm:px-8 py-8 sm:py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-mars/20 border border-mars/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-mars" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <p className="text-white text-[20px] sm:text-[24px] font-bold mb-1">
                  {company} <span className="font-mercure italic text-mars">on Mars</span>
                </p>
                <p className="text-white/40 text-[13px]">Mission created successfully</p>
              </div>

              <div className="px-6 sm:px-8 py-6">
                <p className="text-mars text-[10px] uppercase tracking-[0.25em] font-bold mb-3">Crew invitation link</p>
                <div className="rounded-lg border border-neutral-200 p-3 flex items-center gap-3 mb-5">
                  <p className="flex-1 text-black/60 text-[12px] sm:text-[13px] font-mono truncate">
                    {typeof window !== "undefined" ? window.location.origin : ""}/business/mission/{missionCode}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/business/mission/${missionCode}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="shrink-0 px-4 py-2 rounded-lg bg-mars text-white text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-mars-light transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`/business/mission/${missionCode}`}
                    target="_blank"
                    className="flex-1 py-3 rounded-lg border border-neutral-300 text-center text-black text-[12px] font-bold uppercase tracking-[0.1em] hover:border-neutral-400 transition-all"
                  >
                    Preview
                  </a>
                  <button
                    onClick={reset}
                    className="flex-1 py-3 rounded-lg bg-black text-white text-center text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-neutral-800 transition-all"
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
