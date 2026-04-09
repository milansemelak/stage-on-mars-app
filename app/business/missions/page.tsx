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
  const [error, setError] = useState("");
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
    if (!company.trim() || !question.trim() || !date) return;
    setCreating(true);
    setError("");
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
      } else {
        setError(data.error || "Failed to create mission");
      }
    } catch (err) {
      setError("Connection failed. Try again.");
    }
    setCreating(false);
  }

  function reset() {
    setCompany("");
    setQuestion("");
    setDate("");
    setGroupSize("15-25");
    setLocation("Stage on Mars Flagship Space");
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

  const inputClass = "w-full rounded-lg border-2 border-neutral-200 px-4 py-3.5 text-[15px] text-black font-medium placeholder:text-neutral-300 placeholder:font-normal focus:outline-none focus:border-mars focus:ring-1 focus:ring-mars/20 transition-all bg-neutral-50/50";
  const labelClass = "text-black text-[12px] uppercase tracking-[0.12em] font-bold mb-1.5 block";

  return (
    <div className="min-h-screen bg-neutral-50 text-black">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 bg-white border-b border-neutral-200">
        <Link href="/business">
          <img src="/logo.png" alt="Stage On Mars" className="h-7 sm:h-8 w-auto" />
        </Link>
        <span className="text-neutral-400 text-[10px] uppercase tracking-[0.3em] font-bold">Internal</span>
      </nav>

      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-5 sm:px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <p className="text-mars text-[11px] sm:text-[12px] uppercase tracking-[0.3em] font-bold mb-2">Mission Control</p>
            <h1 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.03em] text-black">Generate Invitation</h1>
          </div>

          {!missionCode ? (
            <div className="space-y-4">

              {/* Client info */}
              <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm px-5 sm:px-7 py-5 sm:py-6 space-y-4">
                <p className="text-mars text-[11px] uppercase tracking-[0.2em] font-extrabold">Client</p>
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
              <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm px-5 sm:px-7 py-5 sm:py-6 space-y-4">
                <p className="text-mars text-[11px] uppercase tracking-[0.2em] font-extrabold">Event Details</p>
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
                    <label className={labelClass}>Maps URL</label>
                    <input value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} placeholder="https://maps.google.com/..." className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Optional" className={inputClass} />
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
              <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm px-5 sm:px-7 py-5 sm:py-6 space-y-4">
                <p className="text-mars text-[11px] uppercase tracking-[0.2em] font-extrabold">Host</p>
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
              <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm px-5 sm:px-7 py-5 sm:py-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-mars text-[11px] uppercase tracking-[0.2em] font-extrabold">Welcome Message</p>
                  <button
                    type="button"
                    onClick={generateWelcome}
                    disabled={generatingMessage || !question.trim() || !company.trim()}
                    className={`text-[11px] font-bold transition-colors px-3 py-1.5 rounded-lg ${
                      generatingMessage || !question.trim() || !company.trim()
                        ? "text-neutral-300 cursor-not-allowed"
                        : "text-mars bg-mars/5 hover:bg-mars/10"
                    }`}
                  >
                    {generatingMessage ? "Generating..." : "AI Generate"}
                  </button>
                </div>
                <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} placeholder="Write an invitation to play..." rows={5} className={`${inputClass} resize-none`} />
              </div>

              {error && (
                <p className="text-red-600 text-[13px] font-medium px-4 py-3 rounded-xl bg-red-50 border-2 border-red-200">{error}</p>
              )}

              <button
                onClick={handleCreate}
                disabled={creating || !company.trim() || !question.trim() || !date}
                className={`w-full py-4 rounded-xl font-bold text-[15px] uppercase tracking-[0.1em] transition-all shadow-sm ${
                  !creating && company.trim() && question.trim() && date
                    ? "bg-black hover:bg-neutral-800 text-white active:scale-[0.99]"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                }`}
              >
                {creating ? "Generating..." : "Generate Mission"}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-black px-6 sm:px-8 py-10 sm:py-12 text-center">
                <img src="/picto.png" alt="" className="w-14 h-14 mx-auto mb-5" />
                <p className="text-white text-[22px] sm:text-[28px] font-bold mb-1">
                  {company} <span className="font-mercure italic text-mars">on Mars</span>
                </p>
                <p className="text-white/40 text-[14px]">Mission created successfully</p>
              </div>

              <div className="px-6 sm:px-8 py-6 sm:py-8">
                <p className="text-mars text-[11px] uppercase tracking-[0.2em] font-extrabold mb-3">Crew invitation link</p>
                <div className="rounded-xl border-2 border-neutral-200 p-4 flex items-center gap-3 mb-6 bg-neutral-50">
                  <p className="flex-1 text-black text-[13px] sm:text-[14px] font-mono truncate">
                    {typeof window !== "undefined" ? window.location.origin : ""}/business/mission/{missionCode}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/business/mission/${missionCode}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="shrink-0 px-5 py-2.5 rounded-lg bg-mars text-white text-[12px] font-bold uppercase tracking-[0.08em] hover:bg-mars-light transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`/business/mission/${missionCode}`}
                    target="_blank"
                    className="flex-1 py-3.5 rounded-xl border-2 border-neutral-200 text-center text-black text-[13px] font-bold uppercase tracking-[0.08em] hover:border-neutral-400 transition-all"
                  >
                    Preview
                  </a>
                  <button
                    onClick={reset}
                    className="flex-1 py-3.5 rounded-xl bg-black text-white text-center text-[13px] font-bold uppercase tracking-[0.08em] hover:bg-neutral-800 transition-all"
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
