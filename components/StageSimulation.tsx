"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Character, SimulationStep } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  characters: Character[];
  simulation?: string;
  simulationSteps?: SimulationStep[];
};

type Position = { x: number; y: number };

// Stage dimensions (SVG viewBox 0 0 100 100)
const CX = 50;
const CY = 50;
const EDGE_R = 38; // radius for edge positions

/**
 * Resolve a position keyword to absolute x,y coordinates.
 * Keywords: center, edge-left, edge-right, edge-top, edge-bottom,
 *           close-to:CharName, far-from:CharName, scattered, circle, frozen
 */
function resolvePosition(
  keyword: string,
  charIndex: number,
  allPositions: Map<string, Position>,
  charCount: number,
  seed: number
): Position | null {
  const kw = keyword.trim().toLowerCase();

  if (kw === "center") {
    return { x: CX + (seed % 5) - 2, y: CY + ((seed * 3) % 5) - 2 };
  }
  if (kw === "edge-left") {
    return { x: CX - EDGE_R, y: CY + ((seed + charIndex * 7) % 12) - 6 };
  }
  if (kw === "edge-right") {
    return { x: CX + EDGE_R, y: CY + ((seed + charIndex * 7) % 12) - 6 };
  }
  if (kw === "edge-top") {
    return { x: CX + ((seed + charIndex * 5) % 16) - 8, y: CY - EDGE_R * 0.6 };
  }
  if (kw === "edge-bottom") {
    return { x: CX + ((seed + charIndex * 5) % 16) - 8, y: CY + EDGE_R * 0.6 };
  }
  if (kw === "scattered") {
    const angle = (seed * 1.7 + charIndex * 2.3) % (2 * Math.PI);
    const r = 15 + (seed % 20);
    return { x: CX + Math.cos(angle) * r, y: CY + Math.sin(angle) * (r * 0.55) };
  }
  if (kw === "circle") {
    const angle = -Math.PI / 2 + (2 * Math.PI * charIndex) / charCount;
    return { x: CX + Math.cos(angle) * 28, y: CY + Math.sin(angle) * 15 };
  }
  if (kw === "frozen") {
    return null; // keep previous position
  }

  // close-to:CharName
  if (kw.startsWith("close-to:")) {
    const targetName = keyword.substring(9).trim();
    const targetPos = allPositions.get(targetName) || allPositions.get(targetName.toLowerCase());
    if (targetPos) {
      const offsetAngle = (charIndex * 1.5 + seed * 0.3) % (2 * Math.PI);
      return {
        x: targetPos.x + Math.cos(offsetAngle) * 5,
        y: targetPos.y + Math.sin(offsetAngle) * 3,
      };
    }
    // If target not found, move toward center
    return { x: CX + ((seed + charIndex) % 8) - 4, y: CY + ((seed + charIndex * 3) % 6) - 3 };
  }

  // far-from:CharName
  if (kw.startsWith("far-from:")) {
    const targetName = keyword.substring(9).trim();
    const targetPos = allPositions.get(targetName) || allPositions.get(targetName.toLowerCase());
    if (targetPos) {
      const dx = CX - targetPos.x;
      const dy = CY - targetPos.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      return {
        x: CX + (dx / len) * EDGE_R * 0.8,
        y: CY + (dy / len) * EDGE_R * 0.5,
      };
    }
    return { x: CX + EDGE_R * 0.7, y: CY };
  }

  return null;
}

/**
 * Compute positions for all characters at a given step.
 * Uses AI-provided position keywords from simulationSteps.
 */
function computeStepPositions(
  characters: Character[],
  steps: SimulationStep[],
  stepIndex: number
): Position[] {
  const count = characters.length;

  // Start with circle formation
  const positions: Position[] = characters.map((_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
    return { x: CX + Math.cos(angle) * 28, y: CY + Math.sin(angle) * 15 };
  });

  // Apply all steps up to and including current step
  for (let s = 0; s <= stepIndex && s < steps.length; s++) {
    const step = steps[s];
    if (!step.positions) continue;

    // Build a lookup of current positions by name
    const posMap = new Map<string, Position>();
    characters.forEach((c, i) => posMap.set(c.name, positions[i]));

    // First pass: resolve non-relative positions
    // Second pass: resolve close-to / far-from (which depend on others)
    const entries = Object.entries(step.positions);
    const deferred: [number, string][] = [];

    for (const [charName, keyword] of entries) {
      const idx = characters.findIndex(
        (c) => c.name === charName || c.name.toLowerCase() === charName.toLowerCase()
      );
      if (idx === -1) continue;

      const kw = keyword.trim().toLowerCase();
      if (kw.startsWith("close-to:") || kw.startsWith("far-from:")) {
        deferred.push([idx, keyword]);
        continue;
      }

      const resolved = resolvePosition(keyword, idx, posMap, count, s * 7 + idx);
      if (resolved) {
        positions[idx] = resolved;
        posMap.set(characters[idx].name, resolved);
      }
    }

    // Second pass for relative positions
    for (const [idx, keyword] of deferred) {
      const resolved = resolvePosition(keyword, idx, posMap, count, s * 7 + idx);
      if (resolved) {
        positions[idx] = resolved;
      }
    }
  }

  return positions;
}

/**
 * Fallback: generate positions from plain text simulation (old format)
 */
function getFallbackPositions(count: number, step: number): Position[] {
  const formations = [
    "circle", "semicircle-top", "cluster-left", "spread",
    "semicircle-bottom", "diagonal", "two-groups", "arc-right",
  ];
  const formation = formations[step % formations.length];
  const activeIndex = step % count;
  const positions: Position[] = [];

  for (let i = 0; i < count; i++) {
    if (i === activeIndex) {
      positions.push({ x: CX + Math.sin(step * 1.7) * 4, y: CY + Math.cos(step * 1.3) * 2 - 2 });
      continue;
    }
    const idx = i < activeIndex ? i : i - 1;
    const others = count - 1;
    let x: number, y: number;
    switch (formation) {
      case "circle": {
        const a = -Math.PI / 2 + (2 * Math.PI * idx) / others;
        x = CX + Math.cos(a) * 28; y = CY + Math.sin(a) * 15.4; break;
      }
      case "semicircle-top": {
        const a = Math.PI + (Math.PI * (idx + 1)) / (others + 1);
        x = CX + Math.cos(a) * 30; y = CY + Math.sin(a) * 18 - 5; break;
      }
      case "semicircle-bottom": {
        const a = (Math.PI * (idx + 1)) / (others + 1);
        x = CX + Math.cos(a) * 30; y = CY + Math.sin(a) * 18 + 5; break;
      }
      case "cluster-left": {
        const a = Math.PI * 0.6 + (Math.PI * 0.8 * idx) / Math.max(others - 1, 1);
        x = CX + Math.cos(a) * 24; y = CY + Math.sin(a) * 14; break;
      }
      case "spread": {
        const a = -Math.PI / 2 + (2 * Math.PI * idx) / others;
        x = CX + Math.cos(a) * 36; y = CY + Math.sin(a) * 18; break;
      }
      case "diagonal": {
        x = 20 + (60 * idx) / Math.max(others - 1, 1);
        y = 30 + (40 * idx) / Math.max(others - 1, 1); break;
      }
      case "two-groups": {
        const isLeft = idx < others / 2;
        const gi = isLeft ? idx : idx - Math.floor(others / 2);
        const gs = isLeft ? Math.floor(others / 2) : Math.ceil(others / 2);
        const gcx = isLeft ? 28 : 72;
        const a = (-Math.PI / 2) + (2 * Math.PI * gi) / Math.max(gs, 1);
        x = gcx + Math.cos(a) * 8; y = CY + Math.sin(a) * 4.8; break;
      }
      default: {
        const a = -Math.PI * 0.4 + (Math.PI * 0.8 * idx) / Math.max(others - 1, 1);
        x = CX + Math.cos(a) * 26; y = CY + Math.sin(a) * 16;
      }
    }
    positions.push({ x, y });
  }
  return positions;
}

function splitIntoSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function StageSimulation({ characters, simulation, simulationSteps }: Props) {
  const { t } = useI18n();

  // Determine narration sentences
  const sentences = useMemo(() => {
    if (simulationSteps?.length) {
      return simulationSteps.map((s) => s.narration);
    }
    return simulation ? splitIntoSentences(simulation) : [];
  }, [simulationSteps, simulation]);

  const hasChoreography = !!simulationSteps?.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Compute target positions for current step
  const targets = useMemo(() => {
    if (hasChoreography && simulationSteps) {
      return computeStepPositions(characters, simulationSteps, currentStep);
    }
    return getFallbackPositions(characters.length, currentStep);
  }, [characters, simulationSteps, hasChoreography, currentStep]);

  // Find which characters moved this step (for highlighting)
  const movedCharacters = useMemo(() => {
    if (!hasChoreography || !simulationSteps?.[currentStep]?.positions) return new Set<number>();
    const moved = new Set<number>();
    const stepPositions = simulationSteps[currentStep].positions;
    for (const charName of Object.keys(stepPositions)) {
      const idx = characters.findIndex(
        (c) => c.name === charName || c.name.toLowerCase() === charName.toLowerCase()
      );
      if (idx !== -1) moved.add(idx);
    }
    return moved;
  }, [hasChoreography, simulationSteps, currentStep, characters]);

  // Animated positions
  const currentPositions = useRef<Position[]>([]);
  const [renderPositions, setRenderPositions] = useState<Position[]>([]);
  const rafRef = useRef<number>(0);

  // Initialize
  useEffect(() => {
    if (currentPositions.current.length !== characters.length) {
      const initial = characters.map((_, i) => {
        const angle = -Math.PI / 2 + (2 * Math.PI * i) / characters.length;
        return { x: CX + Math.cos(angle) * 28, y: CY + Math.sin(angle) * 15 };
      });
      currentPositions.current = initial;
      setRenderPositions(initial);
    }
  }, [characters.length]);

  // Animation loop
  useEffect(() => {
    const animate = (time: number) => {
      const pos = currentPositions.current;
      if (pos.length !== targets.length) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const speed = 0.04;
      for (let i = 0; i < pos.length; i++) {
        pos[i].x = lerp(pos[i].x, targets[i].x, speed);
        pos[i].y = lerp(pos[i].y, targets[i].y, speed);
      }

      const rendered = pos.map((p, i) => ({
        x: p.x + Math.sin(time * 0.001 + i * 2.5) * 0.35,
        y: p.y + Math.cos(time * 0.0008 + i * 1.8) * 0.25,
      }));

      setRenderPositions(rendered);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targets]);

  // Auto-advance narration
  useEffect(() => {
    if (!isPlaying || currentStep >= sentences.length - 1) return;
    const timer = setTimeout(() => setCurrentStep((p) => p + 1), 5000);
    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, sentences.length]);

  // Auto-stop at end
  useEffect(() => {
    if (currentStep >= sentences.length - 1 && isPlaying) {
      setIsPlaying(false);
    }
  }, [currentStep, sentences.length, isPlaying]);

  const handlePlayPause = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setCurrentStep(0);
      setIsPlaying(true);
      return;
    }
    if (currentStep >= sentences.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const progress = sentences.length > 1 ? currentStep / (sentences.length - 1) : 0;

  return (
    <div className="rounded-2xl overflow-hidden bg-[#080808]">
      {/* Stage */}
      <div className="relative w-full aspect-[5/4] sm:aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 70% at 50% 50%, rgba(255,85,0,0.06) 0%, transparent 100%),
              radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,85,0,0.03) 0%, transparent 100%),
              linear-gradient(180deg, #0a0a0a 0%, #060606 100%)
            `,
          }}
        />

        {/* Play overlay */}
        {!hasStarted && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 z-10 flex items-center justify-center group cursor-pointer"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-mars/20 group-hover:bg-mars/30 border border-mars/40 group-hover:border-mars/60 flex items-center justify-center transition-all duration-300 shadow-[0_0_30px_rgba(255,85,0,0.15)] group-hover:shadow-[0_0_40px_rgba(255,85,0,0.25)]">
              <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-mars/80 group-hover:fill-mars transition-colors">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </button>
        )}

        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
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

          {/* LED ring */}
          <ellipse cx="50" cy="50" rx="46" ry="30" fill="none" stroke="rgba(255,85,0,0.06)" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="46" ry="30" fill="none" stroke="rgba(255,85,0,0.12)" strokeWidth="0.8" filter="url(#glow-soft)" />
          <ellipse cx="50" cy="50" rx="46" ry="30" fill="none" stroke="rgba(255,85,0,0.5)" strokeWidth="0.2" />
          <ellipse cx="50" cy="52" rx="40" ry="26" fill="rgba(255,85,0,0.015)" />

          {/* Characters */}
          {renderPositions.map((pos, i) => {
            const char = characters[i];
            if (!char) return null;
            const isAbstract = char.description?.toLowerCase() === "abstract";
            const isActive = hasStarted && movedCharacters.has(i);
            const dotR = isActive ? 1.8 : 1.1;

            return (
              <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                {/* Glow */}
                <circle cx={0} cy={0}
                  r={isActive ? 5 : 2.5}
                  fill={isAbstract ? "rgba(255,255,255,0.02)" : "rgba(255,85,0,0.04)"}
                  filter="url(#glow-char)"
                />

                {/* Dot */}
                <circle cx={0} cy={0} r={dotR}
                  fill={isActive
                    ? (isAbstract ? "rgba(255,255,255,0.5)" : "rgba(255,85,0,0.85)")
                    : (isAbstract ? "rgba(255,255,255,0.2)" : "rgba(255,85,0,0.4)")
                  }
                  stroke={isActive
                    ? (isAbstract ? "rgba(255,255,255,0.7)" : "rgba(255,85,0,1)")
                    : (isAbstract ? "rgba(255,255,255,0.25)" : "rgba(255,85,0,0.5)")
                  }
                  strokeWidth={isActive ? 0.3 : 0.15}
                />

                {/* Active pulse */}
                {isActive && (
                  <circle cx={0} cy={0} r="3" fill="none"
                    stroke={isAbstract ? "rgba(255,255,255,0.15)" : "rgba(255,85,0,0.3)"}
                    strokeWidth="0.15"
                  >
                    <animate attributeName="r" values="2;5;2" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Name */}
                <text
                  x={0} y={isActive ? -3.8 : -2.6}
                  textAnchor="middle"
                  fill={isActive
                    ? (isAbstract ? "rgba(255,255,255,0.7)" : "rgba(255,179,128,0.95)")
                    : (isAbstract ? "rgba(255,255,255,0.15)" : "rgba(255,179,128,0.3)")
                  }
                  fontSize={isActive ? 2.2 : 1.5}
                  fontWeight={isActive ? 700 : 400}
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

      {/* Narration + Controls */}
      {hasStarted && (
        <div className="relative">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-mars/20 to-transparent" />

          <div className="px-5 sm:px-6 pt-4 pb-3">
            <p
              className="font-mercure italic text-white/50 text-sm sm:text-base leading-relaxed animate-fade-in"
              key={currentStep}
            >
              {sentences[currentStep]}
            </p>
          </div>

          <div className="px-5 sm:px-6 pb-4 flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white/50">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : currentStep >= sentences.length - 1 ? (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white/50">
                  <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white/50 ml-0.5">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-mars/50 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <span className="text-[9px] text-white/15 font-mono flex-shrink-0 tabular-nums">
              {currentStep + 1}/{sentences.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
