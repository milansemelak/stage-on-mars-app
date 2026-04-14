"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Perspective } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  play: Play;
  question?: string;
  clientName?: string;
  onOpenPrescription?: () => void;
};

export default function ShareMenu({ play, question, clientName, onOpenPrescription }: Props) {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null); // "link" | "text" | null
  const [shareLoading, setShareLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function flash(type: string) {
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  // Copy share link
  const handleCopyLink = useCallback(async () => {
    if (shareLoading) return;
    setShareLoading(true);
    try {
      const res = await fetch("/api/plays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          play_data: play,
          question: question || "",
          lang,
          client_name: clientName || "",
        }),
      });
      if (!res.ok) throw new Error("Failed to share");
      const data = await res.json();
      const url = `https://playbook.stageonmars.com/p/${data.code}`;
      await navigator.clipboard.writeText(url);
      flash("link");
    } catch (err) {
      console.error("Share link error:", err);
    } finally {
      setShareLoading(false);
    }
  }, [play, question, lang, clientName, shareLoading]);

  // Copy as text
  const handleCopyText = useCallback(async () => {
    const lines = [
      play.name,
      `${play.mood} · ${play.duration} · ${play.playerCount.min}-${play.playerCount.max} ${t.players}`,
      "",
      `${t.theImage}:`,
      play.image,
      "",
      `${t.characters}:`,
      ...play.characters.map((c) => `- ${c.name} (${c.description})`),
      "",
      `${t.authorsRole}:`,
      play.authorRole,
      "",
      `${t.endingPerspective}:`,
      play.endingPerspective,
    ];

    if (play.simulation) {
      lines.push("", `${t.simulationTitle}:`, play.simulation);
    }
    if (play.perspectives?.length) {
      lines.push("", `${t.perspectivesTitle}:`);
      play.perspectives.forEach((p, i) => {
        if (typeof p === "object" && p !== null) {
          const sp = p as Perspective;
          lines.push(`${i + 1}. [${sp.character}] ${sp.insight}`);
        } else {
          lines.push(`${i + 1}. ${p}`);
        }
      });
    }

    if (play.followUpQuestion) {
      lines.push("", `${t.nextQuestion}:`, `"${play.followUpQuestion}"`);
    }

    lines.push("", "---", "playbook.stageonmars.com");

    await navigator.clipboard.writeText(lines.join("\n"));
    flash("text");
  }, [play, t]);

  // Native share (mobile)
  const handleNativeShare = useCallback(async () => {
    if (shareLoading) return;
    setShareLoading(true);
    try {
      const res = await fetch("/api/plays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          play_data: play,
          question: question || "",
          lang,
          client_name: clientName || "",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const url = `https://playbook.stageonmars.com/p/${data.code}`;

      const text = question
        ? `"${question}" — ${play.name}`
        : play.name;

      await navigator.share({
        title: `${play.name} — Stage on Mars`,
        text,
        url,
      });
    } catch (err) {
      // User cancelled or share failed — that's ok
      if ((err as Error).name !== "AbortError") {
        console.error("Native share error:", err);
      }
    } finally {
      setShareLoading(false);
      setOpen(false);
    }
  }, [play, question, lang, clientName, shareLoading]);

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="py-3 px-4 rounded-xl border border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/20 text-sm font-medium transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
        {t.sharePlay}
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 right-0 w-56 rounded-xl border border-white/[0.08] bg-[#141414] shadow-2xl shadow-black/60 overflow-hidden z-50 animate-fade-in">
          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            disabled={shareLoading}
            className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm hover:bg-white/[0.04] transition-colors disabled:opacity-40"
          >
            <span className="w-5 h-5 flex items-center justify-center text-white/30">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-4.122a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
              </svg>
            </span>
            <span className={copied === "link" ? "text-green-400" : "text-white/60"}>
              {copied === "link" ? t.linkCopied : t.shareCopyLink}
            </span>
          </button>

          {/* Copy text */}
          <button
            onClick={handleCopyText}
            className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm hover:bg-white/[0.04] transition-colors"
          >
            <span className="w-5 h-5 flex items-center justify-center text-white/30">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </span>
            <span className={copied === "text" ? "text-green-400" : "text-white/60"}>
              {copied === "text" ? t.textCopied : t.shareCopyText}
            </span>
          </button>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mx-3" />

          {/* Save as image (opens Prescription) */}
          {onOpenPrescription && (
            <button
              onClick={() => {
                setOpen(false);
                onOpenPrescription();
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm hover:bg-white/[0.04] transition-colors"
            >
              <span className="w-5 h-5 flex items-center justify-center text-white/30">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </span>
              <span className="text-white/60">{t.saveImage}</span>
            </button>
          )}

          {/* Native share (mobile) */}
          {hasNativeShare && (
            <>
              <div className="h-px bg-white/[0.06] mx-3" />
              <button
                onClick={handleNativeShare}
                disabled={shareLoading}
                className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm hover:bg-white/[0.04] transition-colors disabled:opacity-40"
              >
                <span className="w-5 h-5 flex items-center justify-center text-white/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </span>
                <span className="text-white/60">{t.shareNative}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
