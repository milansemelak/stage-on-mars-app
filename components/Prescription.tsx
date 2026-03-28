"use client";

import { useRef, useState, useCallback } from "react";
import { Play } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  play: Play;
  question: string;
  onClose: () => void;
  rxNumber?: string;
};

export default function Prescription({ play, question, onClose, rxNumber: rxNumberProp }: Props) {
  const { lang, t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  const locale = lang === "sk" ? "sk-SK" : lang === "cs" ? "cs-CZ" : "en-GB";
  const today = new Date().toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const rxNumber = rxNumberProp || `SOM-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const saveAsImage = useCallback(async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const { toPng } = await import("html-to-image");

      const closeBtn = cardRef.current.querySelector("[data-close-btn]") as HTMLElement;
      if (closeBtn) closeBtn.style.visibility = "hidden";

      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
        cacheBust: true,
      });

      if (closeBtn) closeBtn.style.visibility = "";

      const link = document.createElement("a");
      link.download = `stage-on-mars-${play.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to save image:", err);
      try {
        const { toPng } = await import("html-to-image");
        const dataUrl = await toPng(cardRef.current!, { cacheBust: true });
        const link = document.createElement("a");
        link.download = `stage-on-mars-${play.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err2) {
        console.error("Fallback also failed:", err2);
        alert("Failed to save image. Please try taking a screenshot instead.");
      }
    } finally {
      setSaving(false);
    }
  }, [play.name, saving]);

  const shareViaEmail = useCallback(async () => {
    if (!cardRef.current || sharing) return;
    setSharing(true);

    const fileName = `stage-on-mars-${play.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`;
    const subject = `Stage on Mars — ${play.name}`;
    const bodyText =
      `${t.prescribedFor}: "${question}"\n\n` +
      `${play.name}\n` +
      `${play.mood} · ${play.duration} · ${play.playerCount.min}-${play.playerCount.max} ${t.players}\n\n` +
      `${t.theImage}:\n${play.image}\n\n` +
      `${t.characters}:\n${play.characters.map((c) => `• ${c.name} — ${c.description}`).join("\n")}\n\n` +
      `${t.authorsRole}:\n${play.authorRole}\n\n` +
      `${t.endingPerspective}:\n${play.endingPerspective}\n\n` +
      (play.perspectives && play.perspectives.length > 0
        ? `${t.perspectivesTitle}:\n${play.perspectives.map((p, i) => {
            if (typeof p === "object" && p !== null) {
              const sp = p as { character: string; insight: string };
              return `${i + 1}. [${sp.character}] ${sp.insight}`;
            }
            return `${i + 1}. ${p}`;
          }).join("\n")}\n\n`
        : "") +
      `---\n${t.takeToStage}\nhttps://www.stageonmars.com`;

    try {
      const { toPng } = await import("html-to-image");
      const closeBtn = cardRef.current.querySelector("[data-close-btn]") as HTMLElement;
      if (closeBtn) closeBtn.style.visibility = "hidden";

      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
        cacheBust: true,
      });

      if (closeBtn) closeBtn.style.visibility = "";

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: subject,
          text: bodyText,
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        link.click();

        setTimeout(() => {
          window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText + "\n\n(The play card image has been downloaded — attach it to your email.)")}`;
        }, 500);
      }
    } catch (err) {
      console.error("Share failed:", err);
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    } finally {
      setSharing(false);
    }
  }, [play, question, t, sharing]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg my-4 sm:my-8 animate-fade-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center text-lg font-bold transition-colors backdrop-blur-sm border border-white/20"
        >
          ✕
        </button>

        {/* The card */}
        <div
          ref={cardRef}
          className="bg-[#0a0a0a] border border-mars/40 rounded-2xl overflow-hidden shadow-2xl shadow-mars/15"
        >
          {/* Header — branded stripe */}
          <div className="bg-gradient-to-r from-mars to-mars-dark px-5 sm:px-7 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/90 font-black text-xs sm:text-sm tracking-[0.15em] uppercase">
                  Stage on Mars
                </span>
                <span className="text-white/40 text-xs ml-2">×</span>
                <span className="text-white/60 text-xs ml-2 font-medium tracking-wide">
                  {t.prescriptionHeader}
                </span>
              </div>
              <button
                data-close-btn
                onClick={onClose}
                className="text-white/30 hover:text-white font-bold text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-7 space-y-5">
            {/* RX Number + Title */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-mars/40">
                  {rxNumber}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/20">
                  {today}
                </span>
              </div>

              {/* Question */}
              <div className="border-l-2 border-mars/30 pl-4">
                <span className="text-[10px] uppercase tracking-wider text-white/25 font-bold block mb-1">
                  {t.prescribedFor}
                </span>
                <p className="text-white/60 text-sm italic font-mercure">
                  &ldquo;{question}&rdquo;
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Play name — hero */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {play.name}
              </h2>
              <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                <span className="font-mercure italic text-mars/50">{play.mood}</span>
                <span className="text-white/10">·</span>
                <span>{play.duration}</span>
                <span className="text-white/10">·</span>
                <span>
                  {play.playerCount.min}-{play.playerCount.max} {t.players}
                </span>
              </div>
            </div>

            {/* Play components */}
            <div className="space-y-4 text-sm">
              <RxSection label={t.theImage} color="mars">
                <p className="text-white/55 leading-relaxed">{play.image}</p>
              </RxSection>

              <RxSection label={t.characters} color="mars">
                <div className="flex flex-wrap gap-2 mt-1">
                  {play.characters.map((c, i) => {
                    const isAbstract = c.description?.toLowerCase() === "abstract";
                    return (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                          isAbstract
                            ? "bg-white/[0.04] text-white/50 border border-white/[0.06]"
                            : "bg-mars/10 text-[#ffb380] border border-mars/20"
                        }`}
                      >
                        {c.name}
                        <span className={`text-[9px] ${isAbstract ? "text-white/20" : "text-mars/30"}`}>
                          {isAbstract ? "○" : "●"}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </RxSection>

              <RxSection label={t.authorsRole} color="green">
                <p className="text-white/55 leading-relaxed">{play.authorRole}</p>
              </RxSection>

              <RxSection label={t.endingPerspective} color="purple">
                <p className="text-white/55 leading-relaxed">{play.endingPerspective}</p>
              </RxSection>
            </div>

            {/* Perspective pull-quote */}
            {play.perspectives && play.perspectives.length > 0 && (
              <div className="relative rounded-xl bg-gradient-to-br from-mars/[0.08] to-mars/[0.03] border border-mars/25 px-5 py-4">
                <div className="absolute -top-px left-5 right-5 h-px bg-gradient-to-r from-transparent via-mars/50 to-transparent" />
                <span className="text-[10px] uppercase tracking-wider text-mars-light/50 font-bold block mb-2">
                  {t.perspectivesTitle}
                </span>
                <p className="text-white/85 leading-relaxed font-mercure italic text-sm">
                  &ldquo;{typeof play.perspectives[0] === "object" && play.perspectives[0] !== null ? (play.perspectives[0] as { insight: string }).insight : play.perspectives[0]}&rdquo;
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/15 font-mono tracking-wider">
                playbook.stageonmars.com
              </span>
              <span className="text-[10px] text-white/15 italic">
                Question × Play = Perspective
              </span>
            </div>

            {/* CTA */}
            <a
              href="https://www.stageonmars.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-3.5 rounded-xl bg-mars hover:bg-mars-light text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-mars/20"
            >
              {t.takeToStage} →
            </a>
          </div>
        </div>

        {/* Action buttons below card */}
        <div className="flex gap-3 mt-4 justify-center">
          <button
            onClick={saveAsImage}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-white/50 hover:text-white hover:border-white/30 hover:bg-white/[0.06] text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-40"
          >
            📷 {saving ? t.saving : t.saveImage}
          </button>
          <button
            onClick={shareViaEmail}
            disabled={sharing}
            className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-white/50 hover:text-white hover:border-white/30 hover:bg-white/[0.06] text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-40"
          >
            ✉️ {sharing ? t.preparing : t.shareEmail}
          </button>
        </div>
      </div>
    </div>
  );
}

function RxSection({
  label,
  color,
  children,
}: {
  label: string;
  color: "mars" | "green" | "purple";
  children: React.ReactNode;
}) {
  const colors = {
    mars: "text-mars-light/50",
    green: "text-green-400/50",
    purple: "text-purple-400/50",
  };

  return (
    <div>
      <span className={`text-[10px] uppercase tracking-wider font-bold ${colors[color]}`}>
        {label}
      </span>
      {children}
    </div>
  );
}
