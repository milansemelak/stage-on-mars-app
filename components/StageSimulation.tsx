"use client";

import { useState, useEffect, useMemo } from "react";
import { Character } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  characters: Character[];
  simulation: string;
};

// Position characters on a circle within the stage
function getCharacterPositions(count: number, seed: number) {
  const positions: { x: number; y: number }[] = [];
  const cx = 50;
  const cy = 50;
  const r = 22; // keep inside the stage ring
  const startAngle = -Math.PI / 2;

  for (let i = 0; i < count; i++) {
    const angle = startAngle + (2 * Math.PI * i) / count;
    // Deterministic jitter based on seed
    const jx = Math.sin(seed + i * 137.5) * 4;
    const jy = Math.cos(seed + i * 97.3) * 3;
    positions.push({
      x: cx + Math.cos(angle) * r + jx,
      y: cy + Math.sin(angle) * r + jy,
    });
  }
  return positions;
}

// Split simulation text into sentences
function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
}

// Connection pairs — neighbors + a cross
function getConnections(count: number): [number, number][] {
  const conns: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    conns.push([i, (i + 1) % count]);
  }
  if (count >= 4) conns.push([0, Math.floor(count / 2)]);
  if (count >= 6) conns.push([1, Math.floor(count / 2) + 1]);
  return conns;
}

export default function StageSimulation({ characters, simulation }: Props) {
  const { t } = useI18n();
  const sentences = useMemo(() => splitIntoSentences(simulation), [simulation]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const connections = useMemo(
    () => getConnections(characters.length),
    [characters.length]
  );

  // Positions shift slightly each step
  const positions = useMemo(
    () => getCharacterPositions(characters.length, currentStep * 0.7),
    [characters.length, currentStep]
  );

  // Auto-advance narration
  useEffect(() => {
    if (!isPlaying || currentStep >= sentences.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, sentences.length]);

  function togglePlayPause() {
    setIsPlaying(!isPlaying);
  }

  function goToStep(step: number) {
    setCurrentStep(step);
    setIsPlaying(false);
  }

  // The stage is an ellipse (circle in perspective)
  // Stage center and radii in viewBox coordinates
  const stageCx = 50;
  const stageCy = 54; // slightly below center for perspective
  const stageRx = 40;
  const stageRy = 24; // compressed vertically = perspective view

  return (
    <div className="rounded-2xl border border-mars/20 overflow-hidden bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-b border-white/[0.06]">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-mars">
          {t.simulationTitle}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/20 font-mercure italic tracking-wide">
            {t.simulationSub}
          </span>
          <button
            onClick={togglePlayPause}
            className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            {isPlaying ? "||" : "▶"}
          </button>
        </div>
      </div>

      {/* Stage area */}
      <div className="relative w-full aspect-[16/9]" style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #080808 100%)" }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 80"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow filter for the ring */}
            <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle glow for characters */}
            <filter id="char-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Stage surface gradient — dark with subtle mars reflection */}
            <radialGradient id="stage-surface" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="rgba(255,85,0,0.03)" />
              <stop offset="70%" stopColor="rgba(255,85,0,0.01)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>

            {/* Ring gradient */}
            <radialGradient id="ring-reflection" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="rgba(255,85,0,0.06)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          {/* Ambient reflection on floor */}
          <ellipse
            cx={stageCx}
            cy={stageCy + 2}
            rx={stageRx + 6}
            ry={stageRy + 4}
            fill="url(#ring-reflection)"
          />

          {/* Stage surface */}
          <ellipse
            cx={stageCx}
            cy={stageCy}
            rx={stageRx}
            ry={stageRy}
            fill="url(#stage-surface)"
          />

          {/* The glowing LED ring — outer glow */}
          <ellipse
            cx={stageCx}
            cy={stageCy}
            rx={stageRx}
            ry={stageRy}
            fill="none"
            stroke="rgba(255,85,0,0.15)"
            strokeWidth="1.5"
            filter="url(#ring-glow)"
          />

          {/* The glowing LED ring — sharp line */}
          <ellipse
            cx={stageCx}
            cy={stageCy}
            rx={stageRx}
            ry={stageRy}
            fill="none"
            stroke="#FF5500"
            strokeWidth="0.4"
            opacity="0.7"
          />

          {/* Inner subtle ring */}
          <ellipse
            cx={stageCx}
            cy={stageCy}
            rx={stageRx - 0.8}
            ry={stageRy - 0.5}
            fill="none"
            stroke="rgba(255,85,0,0.08)"
            strokeWidth="0.2"
          />

          {/* Connections between characters */}
          {connections.map(([a, b], i) => {
            const pa = positions[a];
            const pb = positions[b];
            if (!pa || !pb) return null;
            // Map positions to stage perspective
            const ax = stageCx + (pa.x - 50) * (stageRx / 38);
            const ay = stageCy + (pa.y - 50) * (stageRy / 38);
            const bx = stageCx + (pb.x - 50) * (stageRx / 38);
            const by = stageCy + (pb.y - 50) * (stageRy / 38);

            return (
              <line
                key={`conn-${i}`}
                x1={ax}
                y1={ay}
                x2={bx}
                y2={by}
                stroke="rgba(255,85,0,0.07)"
                strokeWidth="0.15"
                strokeDasharray="0.8,0.8"
              />
            );
          })}

          {/* Characters on stage */}
          {positions.map((pos, i) => {
            const char = characters[i];
            if (!char) return null;
            const isAbstract = char.description?.toLowerCase() === "abstract";
            const isActive = i === currentStep % characters.length;

            // Map to perspective stage coordinates
            const cx = stageCx + (pos.x - 50) * (stageRx / 38);
            const cy = stageCy + (pos.y - 50) * (stageRy / 38);

            return (
              <g key={i}>
                {/* Active pulse */}
                {isActive && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="2.8"
                    fill="none"
                    stroke={isAbstract ? "rgba(255,255,255,0.12)" : "rgba(255,85,0,0.2)"}
                    strokeWidth="0.25"
                    className="animate-pulse-glow"
                  />
                )}

                {/* Character dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? "1.8" : "1.5"}
                  fill={isAbstract ? "rgba(255,255,255,0.15)" : "rgba(255,85,0,0.4)"}
                  stroke={isAbstract ? "rgba(255,255,255,0.25)" : "rgba(255,85,0,0.6)"}
                  strokeWidth="0.3"
                  filter="url(#char-glow)"
                />

                {/* Reflection dot below */}
                <circle
                  cx={cx}
                  cy={cy + 0.6}
                  r="0.8"
                  fill={isAbstract ? "rgba(255,255,255,0.03)" : "rgba(255,85,0,0.06)"}
                />

                {/* Name label */}
                <text
                  x={cx}
                  y={cy - 3}
                  textAnchor="middle"
                  fill={isAbstract ? "rgba(255,255,255,0.3)" : "rgba(255,179,128,0.65)"}
                  fontSize="1.8"
                  fontWeight={isAbstract ? "400" : "600"}
                  fontStyle={isAbstract ? "italic" : "normal"}
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
      <div className="px-5 sm:px-6 py-4 border-t border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="flex gap-3 items-start">
          <div className="shrink-0 w-6 h-6 rounded-full bg-mars/15 border border-mars/30 flex items-center justify-center mt-0.5">
            <span className="text-[10px] font-bold text-mars">{currentStep + 1}</span>
          </div>
          <p
            className="font-mercure italic text-white/55 text-sm sm:text-base leading-relaxed animate-fade-in"
            key={currentStep}
          >
            {sentences[currentStep]}
          </p>
        </div>
      </div>

      {/* Step dots */}
      <div className="px-5 sm:px-6 pb-4 flex items-center gap-3">
        <div className="flex gap-1.5">
          {sentences.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentStep
                  ? "bg-mars shadow-[0_0_6px_rgba(255,85,0,0.4)] scale-125"
                  : i < currentStep
                  ? "bg-mars/30"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] text-white/15 font-mono">
          {currentStep + 1} / {sentences.length}
        </span>
      </div>
    </div>
  );
}
