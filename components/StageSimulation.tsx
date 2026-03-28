"use client";

import { useState, useEffect, useMemo } from "react";
import { Character } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  characters: Character[];
  simulation: string;
};

function getCharacterPositions(count: number, step: number) {
  const positions: { x: number; y: number }[] = [];
  const cx = 50;
  const cy = 48;
  const r = 18;
  const startAngle = -Math.PI / 2;

  for (let i = 0; i < count; i++) {
    const angle = startAngle + (2 * Math.PI * i) / count;
    const drift = Math.sin(step * 0.5 + i * 2.1) * 2;
    const driftY = Math.cos(step * 0.4 + i * 1.7) * 1.5;
    positions.push({
      x: cx + Math.cos(angle) * (r + drift),
      y: cy + Math.sin(angle) * (r * 0.6 + driftY), // compress Y for perspective
    });
  }
  return positions;
}

function splitIntoSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
}

export default function StageSimulation({ characters, simulation }: Props) {
  const { t } = useI18n();
  const sentences = useMemo(() => splitIntoSentences(simulation), [simulation]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const positions = useMemo(
    () => getCharacterPositions(characters.length, currentStep),
    [characters.length, currentStep]
  );

  useEffect(() => {
    if (!isPlaying || currentStep >= sentences.length - 1) return;
    const timer = setTimeout(() => setCurrentStep((p) => p + 1), 4000);
    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, sentences.length]);

  return (
    <div className="rounded-2xl overflow-hidden bg-[#080808]">
      {/* Stage area */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        {/* Background atmosphere */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 55%, rgba(255,85,0,0.06) 0%, transparent 100%),
              radial-gradient(ellipse 60% 35% at 50% 55%, rgba(255,85,0,0.03) 0%, transparent 100%),
              linear-gradient(180deg, #0a0a0a 0%, #060606 100%)
            `,
          }}
        />

        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 80"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="b1" />
              <feGaussianBlur stdDeviation="2" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-char" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>

          {/* LED ring — outer glow (wide, faint) */}
          <ellipse
            cx="50" cy="48" rx="36" ry="20"
            fill="none"
            stroke="rgba(255,85,0,0.06)"
            strokeWidth="3"
          />

          {/* LED ring — medium glow */}
          <ellipse
            cx="50" cy="48" rx="36" ry="20"
            fill="none"
            stroke="rgba(255,85,0,0.12)"
            strokeWidth="0.8"
            filter="url(#glow-soft)"
          />

          {/* LED ring — sharp thin line */}
          <ellipse
            cx="50" cy="48" rx="36" ry="20"
            fill="none"
            stroke="rgba(255,85,0,0.5)"
            strokeWidth="0.2"
          />

          {/* Floor reflection — subtle gradient inside the ring */}
          <ellipse
            cx="50" cy="50" rx="30" ry="16"
            fill="rgba(255,85,0,0.015)"
          />

          {/* Characters */}
          {positions.map((pos, i) => {
            const char = characters[i];
            if (!char) return null;
            const isAbstract = char.description?.toLowerCase() === "abstract";
            const isActive = i === currentStep % characters.length;
            const dotR = isActive ? 1.4 : 1.1;

            return (
              <g key={i}>
                {/* Glow under character */}
                <circle
                  cx={pos.x} cy={pos.y} r="3"
                  fill={isAbstract ? "rgba(255,255,255,0.02)" : "rgba(255,85,0,0.04)"}
                  filter="url(#glow-char)"
                />

                {/* Character dot */}
                <circle
                  cx={pos.x} cy={pos.y} r={dotR}
                  fill={isAbstract ? "rgba(255,255,255,0.2)" : "rgba(255,85,0,0.5)"}
                  stroke={isAbstract ? "rgba(255,255,255,0.3)" : "rgba(255,85,0,0.7)"}
                  strokeWidth="0.2"
                />

                {/* Active indicator */}
                {isActive && (
                  <circle
                    cx={pos.x} cy={pos.y} r="2.5"
                    fill="none"
                    stroke={isAbstract ? "rgba(255,255,255,0.1)" : "rgba(255,85,0,0.15)"}
                    strokeWidth="0.15"
                    className="animate-pulse-glow"
                  />
                )}

                {/* Name */}
                <text
                  x={pos.x} y={pos.y - 2.8}
                  textAnchor="middle"
                  fill={isAbstract ? "rgba(255,255,255,0.25)" : "rgba(255,179,128,0.5)"}
                  fontSize="1.6"
                  fontWeight="500"
                  fontStyle={isAbstract ? "italic" : "normal"}
                  letterSpacing="0.05"
                  className="select-none"
                >
                  {char.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Narration */}
      <div className="relative">
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-mars/20 to-transparent" />
        <div className="px-5 sm:px-6 py-4">
          <p
            className="font-mercure italic text-white/50 text-sm sm:text-base leading-relaxed animate-fade-in"
            key={currentStep}
          >
            {sentences[currentStep]}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 sm:px-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {sentences.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentStep
                    ? "bg-mars shadow-[0_0_4px_rgba(255,85,0,0.4)]"
                    : i < currentStep
                    ? "bg-mars/25"
                    : "bg-white/8"
                }`}
              />
            ))}
          </div>
          <span className="text-[9px] text-white/12 font-mono ml-1">
            {currentStep + 1}/{sentences.length}
          </span>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-[9px] text-white/25 hover:text-white/50 transition-colors uppercase tracking-widest font-bold"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
