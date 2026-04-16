"use client";

import { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Character, SimulationStep } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  characters: Character[];
  simulation?: string;
  simulationSteps?: SimulationStep[];
  loading?: boolean;
  clientName?: string;
  onEnd?: () => void;
};

type Position = { x: number; y: number };

// Stage dimensions (SVG viewBox 0 0 100 100)
const CX = 50;
const CY = 50;
const EDGE_R = 30;

/**
 * Resolve a position keyword to absolute x,y coordinates.
 * Extended vocabulary for richer choreography.
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
    const offsetAngle = (charIndex * 2.2 + seed * 0.7) % (2 * Math.PI);
    return {
      x: CX + Math.cos(offsetAngle) * 5,
      y: CY + Math.sin(offsetAngle) * 3,
    };
  }
  if (kw === "edge-left") {
    return { x: CX - EDGE_R, y: CY + ((seed + charIndex * 7) % 12) - 6 };
  }
  if (kw === "edge-right") {
    return { x: CX + EDGE_R, y: CY + ((seed + charIndex * 7) % 12) - 6 };
  }
  if (kw === "edge-top") {
    return { x: CX + ((seed + charIndex * 5) % 16) - 8, y: CY - EDGE_R };
  }
  if (kw === "edge-bottom") {
    return { x: CX + ((seed + charIndex * 5) % 16) - 8, y: CY + EDGE_R };
  }
  if (kw === "scattered") {
    const angle = (seed * 1.7 + charIndex * 2.3) % (2 * Math.PI);
    const r = 15 + (seed % 20);
    return { x: CX + Math.cos(angle) * r, y: CY + Math.sin(angle) * (r * 0.55) };
  }
  if (kw === "circle") {
    const angle = -Math.PI / 2 + (2 * Math.PI * charIndex) / charCount;
    return { x: CX + Math.cos(angle) * 30, y: CY + Math.sin(angle) * 30 };
  }
  if (kw === "frozen") {
    return null;
  }

  // ── New movement vocabulary ──────────────────────────────

  // Kneeling — lower position (toward bottom, closer to center)
  if (kw === "kneeling") {
    const current = allPositions.get([...allPositions.keys()][charIndex]);
    if (current) {
      return { x: current.x, y: Math.min(current.y + 8, CY + EDGE_R) };
    }
    return { x: CX + ((seed + charIndex * 5) % 12) - 6, y: CY + 18 };
  }

  // Rising — upper position (toward top)
  if (kw === "rising") {
    const current = allPositions.get([...allPositions.keys()][charIndex]);
    if (current) {
      return { x: current.x, y: Math.max(current.y - 10, CY - EDGE_R) };
    }
    return { x: CX + ((seed + charIndex * 5) % 12) - 6, y: CY - 18 };
  }

  // Retreating — moves away from center toward nearest edge
  if (kw === "retreating") {
    const current = allPositions.get([...allPositions.keys()][charIndex]);
    if (current) {
      const dx = current.x - CX;
      const dy = current.y - CY;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      return {
        x: CX + (dx / len) * EDGE_R * 0.95,
        y: CY + (dy / len) * EDGE_R * 0.7,
      };
    }
    return { x: CX + EDGE_R * 0.8, y: CY };
  }

  // Approaching-slowly — moves toward center (not quite center)
  if (kw === "approaching-center") {
    const current = allPositions.get([...allPositions.keys()][charIndex]);
    if (current) {
      return {
        x: current.x + (CX - current.x) * 0.5,
        y: current.y + (CY - current.y) * 0.5,
      };
    }
    return { x: CX + 8, y: CY + 5 };
  }

  // Line formation — left side
  if (kw === "line-left") {
    return { x: CX - 20, y: CY - 15 + (charIndex * 10) };
  }
  // Line formation — right side
  if (kw === "line-right") {
    return { x: CX + 20, y: CY - 15 + (charIndex * 10) };
  }

  // Triangle formation
  if (kw === "triangle") {
    const triPositions = [
      { x: CX, y: CY - 20 },       // top
      { x: CX - 18, y: CY + 12 },   // bottom-left
      { x: CX + 18, y: CY + 12 },   // bottom-right
    ];
    return triPositions[charIndex % 3];
  }

  // Cluster — tight group near center
  if (kw === "cluster") {
    const angle = (charIndex * 2.4 + seed) % (2 * Math.PI);
    const r = 6 + (charIndex % 3) * 4;
    return { x: CX + Math.cos(angle) * r, y: CY + Math.sin(angle) * (r * 0.6) };
  }

  // back-to-back:CharName — near target but facing away
  if (kw.startsWith("back-to-back:")) {
    const targetName = keyword.substring(13).trim();
    const targetPos = allPositions.get(targetName) || allPositions.get(targetName.toLowerCase());
    if (targetPos) {
      const dx = targetPos.x - CX;
      const dy = targetPos.y - CY;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      return {
        x: targetPos.x + (dx / len) * 10,
        y: targetPos.y + (dy / len) * 6,
      };
    }
    return { x: CX + 12, y: CY };
  }

  // circling:CharName — orbit position around target
  if (kw.startsWith("circling:")) {
    const targetName = keyword.substring(9).trim();
    const targetPos = allPositions.get(targetName) || allPositions.get(targetName.toLowerCase());
    if (targetPos) {
      const orbitAngle = (seed * 1.3 + charIndex * 2.1) % (2 * Math.PI);
      return {
        x: targetPos.x + Math.cos(orbitAngle) * 14,
        y: targetPos.y + Math.sin(orbitAngle) * 8,
      };
    }
    return { x: CX + 14, y: CY };
  }

  // blocking-path-of:CharName — between target and center
  if (kw.startsWith("blocking-path-of:")) {
    const targetName = keyword.substring(17).trim();
    const targetPos = allPositions.get(targetName) || allPositions.get(targetName.toLowerCase());
    if (targetPos) {
      return {
        x: (targetPos.x + CX) / 2,
        y: (targetPos.y + CY) / 2,
      };
    }
    return { x: CX, y: CY + 8 };
  }

  // facing-away — at edge, turned outward
  if (kw === "facing-away") {
    const angle = (seed * 1.5 + charIndex * 2.7) % (2 * Math.PI);
    return {
      x: CX + Math.cos(angle) * EDGE_R * 0.85,
      y: CY + Math.sin(angle) * EDGE_R * 0.6,
    };
  }

  // close-to:CharName
  if (kw.startsWith("close-to:")) {
    const targetName = keyword.substring(9).trim();
    const targetPos = allPositions.get(targetName) || allPositions.get(targetName.toLowerCase());
    if (targetPos) {
      const offsetAngle = (charIndex * 1.8 + seed * 0.5) % (2 * Math.PI);
      return {
        x: targetPos.x + Math.cos(offsetAngle) * 12,
        y: targetPos.y + Math.sin(offsetAngle) * 7,
      };
    }
    return { x: CX + ((seed + charIndex) % 14) - 7, y: CY + ((seed + charIndex * 3) % 10) - 5 };
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

  for (let s = 0; s <= stepIndex && s < steps.length; s++) {
    const step = steps[s];
    if (!step.positions) continue;

    const posMap = new Map<string, Position>();
    characters.forEach((c, i) => posMap.set(c.name, positions[i]));

    // First pass: non-relative; Second pass: relative
    const entries = Object.entries(step.positions);
    const deferred: [number, string][] = [];

    for (const [charName, keyword] of entries) {
      const idx = characters.findIndex(
        (c) => c.name === charName || c.name.toLowerCase() === charName.toLowerCase()
      );
      if (idx === -1) continue;

      const kw = keyword.trim().toLowerCase();
      if (kw.startsWith("close-to:") || kw.startsWith("far-from:") || kw.startsWith("back-to-back:") || kw.startsWith("circling:") || kw.startsWith("blocking-path-of:")) {
        deferred.push([idx, keyword]);
        continue;
      }

      const resolved = resolvePosition(keyword, idx, posMap, count, s * 7 + idx);
      if (resolved) {
        positions[idx] = resolved;
        posMap.set(characters[idx].name, resolved);
      }
    }

    for (const [idx, keyword] of deferred) {
      const resolved = resolvePosition(keyword, idx, posMap, count, s * 7 + idx);
      if (resolved) {
        positions[idx] = resolved;
      }
    }
  }

  separatePositions(positions);
  return positions;
}

/**
 * Push characters apart so they never overlap.
 */
function separatePositions(positions: Position[]) {
  const MIN_DIST = positions.length > 5 ? 12 : 16;
  const iterations = 8;

  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MIN_DIST && dist > 0.01) {
          const push = (MIN_DIST - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          positions[i].x -= nx * push;
          positions[i].y -= ny * push;
          positions[j].x += nx * push;
          positions[j].y += ny * push;
        } else if (dist <= 0.01) {
          const angle = (i * 2.3 + j * 1.7) % (2 * Math.PI);
          positions[i].x -= Math.cos(angle) * MIN_DIST / 2;
          positions[i].y -= Math.sin(angle) * MIN_DIST / 2;
          positions[j].x += Math.cos(angle) * MIN_DIST / 2;
          positions[j].y += Math.sin(angle) * MIN_DIST / 2;
        }
      }
    }
  }

  const MAX_R = 34;
  for (const p of positions) {
    const dx = p.x - CX;
    const dy = p.y - CY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > MAX_R) {
      p.x = CX + (dx / dist) * MAX_R;
      p.y = CY + (dy / dist) * MAX_R;
    }
  }
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
  separatePositions(positions);
  return positions;
}

function splitIntoSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
}

// Smooth ease-in-out for theatrical movement
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Play the hotel bell sound
function playBell() {
  try {
    const audio = new Audio("/bell.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {});
  } catch {
    // Audio not available — silent fail
  }
}

export default function StageSimulation({ characters, simulation, simulationSteps, loading, clientName, onEnd }: Props) {
  const { t } = useI18n();

  const authorLabel = clientName || t.author;
  const allCharacters = useMemo(() => {
    // Author is ALWAYS added as a separate gold entity, even if a character shares the same name
    return [{ name: authorLabel, description: "author" }, ...characters.filter(
      (c) => c.name.toLowerCase() !== authorLabel.toLowerCase()
    )];
  }, [characters, authorLabel]);

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
  const [hasEnded, setHasEnded] = useState(false);
  const [endingPhase, setEndingPhase] = useState(0);
  const [fadeState, setFadeState] = useState<"visible" | "fading">("visible");


  // Staggered reveal: narration appears after movement settles
  const [narrationStep, setNarrationStep] = useState(0);
  const narrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearNarrationTimer = () => {
    if (narrationTimerRef.current) {
      clearTimeout(narrationTimerRef.current);
      narrationTimerRef.current = null;
    }
  };

  // When currentStep changes, delay narration reveal
  useEffect(() => {
    if (!hasStarted || hasEnded) return;
    clearNarrationTimer();
    if (currentStep === 0) {
      // First step: show immediately
      setNarrationStep(0);
      setFadeState("visible");
      return;
    }
    // Hide narration, wait for movement to settle, then reveal
    setFadeState("fading");
    narrationTimerRef.current = setTimeout(() => {
      setNarrationStep(currentStep);
      setFadeState("visible");
    }, 1500);
    return () => clearNarrationTimer();
  }, [currentStep, hasStarted, hasEnded]);

  // Cleanup on unmount
  useEffect(() => clearNarrationTimer, []);

  // Final circle formation for ritual ending
  const finalCirclePositions = useMemo(() => {
    const count = allCharacters.length;
    return allCharacters.map((_, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
      return { x: CX + Math.cos(angle) * 22, y: CY + Math.sin(angle) * 22 };
    });
  }, [allCharacters]);

  // Compute target positions for current step
  const targets = useMemo(() => {
    if (hasEnded) return finalCirclePositions;
    if (hasChoreography && simulationSteps) {
      return computeStepPositions(allCharacters, simulationSteps, currentStep);
    }
    return getFallbackPositions(allCharacters.length, currentStep);
  }, [allCharacters, simulationSteps, hasChoreography, currentStep, hasEnded, finalCirclePositions]);

  // Previous positions for trails
  const prevPositionsRef = useRef<Position[]>([]);

  // Which characters moved this step
  const movedCharacters = useMemo(() => {
    if (!hasChoreography || !simulationSteps?.[currentStep]?.positions) return new Set<number>();
    const moved = new Set<number>();
    const stepPositions = simulationSteps[currentStep].positions;
    for (const charName of Object.keys(stepPositions)) {
      const idx = allCharacters.findIndex(
        (c) => c.name === charName || c.name.toLowerCase() === charName.toLowerCase()
      );
      if (idx !== -1) moved.add(idx);
    }
    return moved;
  }, [hasChoreography, simulationSteps, currentStep, allCharacters]);

  // Connection lines — characters mentioned in the same step are connected
  const connectionLines = useMemo(() => {
    if (!hasChoreography || !simulationSteps?.[currentStep]?.positions) return [];
    const movedIndices = [...movedCharacters];
    const lines: [number, number][] = [];
    // Connect pairs of characters that moved in the same step (max 3 lines)
    for (let i = 0; i < movedIndices.length && lines.length < 3; i++) {
      for (let j = i + 1; j < movedIndices.length && lines.length < 3; j++) {
        lines.push([movedIndices[i], movedIndices[j]]);
      }
    }
    return lines;
  }, [hasChoreography, simulationSteps, currentStep, movedCharacters]);

  // Direct DOM refs for smooth animation (bypasses React reconciler)
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const currentPositions = useRef<Position[]>([]);
  const [renderPositions, setRenderPositions] = useState<Position[]>([]);
  const rafRef = useRef<number>(0);
  const transitionStartRef = useRef<number>(0);
  const transitionFromRef = useRef<Position[]>([]);

  // Track when targets change to start eased transition
  const prevTargetsRef = useRef<Position[]>([]);
  useEffect(() => {
    if (currentPositions.current.length === targets.length) {
      transitionFromRef.current = currentPositions.current.map(p => ({ ...p }));
      transitionStartRef.current = performance.now();
      prevPositionsRef.current = currentPositions.current.map(p => ({ ...p }));
    }
    prevTargetsRef.current = targets;
  }, [targets]);

  // Initialize
  useEffect(() => {
    if (currentPositions.current.length !== allCharacters.length) {
      const initial = allCharacters.map((c, i) => {
        if (c.description === "author") {
          return { x: CX, y: CY + EDGE_R };
        }
        const angle = -Math.PI / 2 + (2 * Math.PI * i) / allCharacters.length;
        return { x: CX + Math.cos(angle) * 28, y: CY + Math.sin(angle) * 15 };
      });
      currentPositions.current = initial;
      transitionFromRef.current = initial.map(p => ({ ...p }));
      prevPositionsRef.current = initial.map(p => ({ ...p }));
      setRenderPositions(initial);
    }
  }, [allCharacters]);

  // Animation loop — direct DOM manipulation for butter-smooth 60fps
  useEffect(() => {
    const TRANSITION_DURATION = 2500;

    const animate = (time: number) => {
      const pos = currentPositions.current;
      if (pos.length !== targets.length) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = time - transitionStartRef.current;
      const rawT = Math.min(elapsed / TRANSITION_DURATION, 1);
      const t = easeInOutCubic(rawT);

      const from = transitionFromRef.current;
      if (from.length === targets.length) {
        for (let i = 0; i < pos.length; i++) {
          pos[i].x = from[i].x + (targets[i].x - from[i].x) * t;
          pos[i].y = from[i].y + (targets[i].y - from[i].y) * t;
        }
      } else {
        for (let i = 0; i < pos.length; i++) {
          pos[i].x += (targets[i].x - pos[i].x) * 0.06;
          pos[i].y += (targets[i].y - pos[i].y) * 0.06;
        }
      }

      // Direct DOM update — no React re-renders during animation
      for (let i = 0; i < pos.length; i++) {
        const el = groupRefs.current[i];
        if (el) el.setAttribute("transform", `translate(${pos[i].x}, ${pos[i].y})`);
      }

      const settled = from.length === targets.length
        ? rawT >= 1
        : pos.every((p, i) => Math.abs(p.x - targets[i].x) < 0.1 && Math.abs(p.y - targets[i].y) < 0.1);

      if (!settled) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Sync React state once at end for labels, trails, connections
        setRenderPositions(pos.map(p => ({ ...p })));
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targets]);

  // Idle breathing — gentle orbital drift when not playing
  const breathingRafRef = useRef<number>(0);
  useEffect(() => {
    const isIdle = !hasStarted || hasEnded;
    if (!isIdle || loading) {
      if (breathingRafRef.current) cancelAnimationFrame(breathingRafRef.current);
      return;
    }

    const basePositions = currentPositions.current.map(p => ({ ...p }));
    const breathe = (time: number) => {
      for (let i = 0; i < basePositions.length; i++) {
        const el = groupRefs.current[i];
        if (!el) continue;
        const phase = time * 0.0004 + i * 1.8;
        const dx = Math.sin(phase) * 1.2;
        const dy = Math.cos(phase * 0.7) * 0.8;
        el.setAttribute("transform", `translate(${basePositions[i].x + dx}, ${basePositions[i].y + dy})`);
      }
      breathingRafRef.current = requestAnimationFrame(breathe);
    };
    breathingRafRef.current = requestAnimationFrame(breathe);
    return () => { if (breathingRafRef.current) cancelAnimationFrame(breathingRafRef.current); };
  }, [hasStarted, hasEnded, loading]);

  // After every React render, re-apply RAF positions so React never overwrites
  // the smooth DOM state with stale renderPositions
  useLayoutEffect(() => {
    const pos = currentPositions.current;
    for (let i = 0; i < pos.length; i++) {
      const el = groupRefs.current[i];
      if (el) el.setAttribute("transform", `translate(${pos[i].x}, ${pos[i].y})`);
    }
  });

  // Author-controlled: advance to next step on tap (no auto-advance)
  const advanceStep = () => {
    if (!hasStarted || hasEnded) return;
    if (currentStep < sentences.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      triggerEnding();
    }
  };

  // Trigger ritual ending
  const endingTriggered = useRef(false);
  const triggerEnding = () => {
    if (endingTriggered.current) return;
    endingTriggered.current = true;
    clearNarrationTimer();
    setIsPlaying(false);
    setTimeout(() => {
      setHasEnded(true);
      setEndingPhase(1);
    }, 2000);
    setTimeout(() => {
      setEndingPhase(2);
    }, 4000);
  };

  const handleStart = () => {
    playBell();
    setHasStarted(true);
    setHasEnded(false);
    setEndingPhase(0);
    endingTriggered.current = false;
    setCurrentStep(0);
    setNarrationStep(0);
    setIsPlaying(true);
    setFadeState("visible");
  };

  const handleReplay = () => {
    setHasEnded(false);
    setEndingPhase(0);
    endingTriggered.current = false;
    setCurrentStep(0);
    setNarrationStep(0);
    setIsPlaying(true);
    setFadeState("visible");
  };

  const progress = sentences.length > 1 ? currentStep / (sentences.length - 1) : 0;

  // Trail positions — ghostly echo of previous positions
  const trails = useMemo(() => {
    if (!hasStarted || prevPositionsRef.current.length !== renderPositions.length) return [];
    return prevPositionsRef.current.map((prev, i) => {
      const curr = renderPositions[i];
      if (!curr) return null;
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Only show trail if character moved significantly
      if (dist < 3) return null;
      return { from: prev, to: curr, index: i };
    }).filter(Boolean) as { from: Position; to: Position; index: number }[];
  }, [renderPositions, hasStarted]);

  return (
    <div className="rounded-2xl overflow-hidden bg-[#080808] flex flex-col">
      {/* Stage — fills available space */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden aspect-square">
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

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-x-0 bottom-4 sm:bottom-6 z-10 flex justify-center">
            <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-sm rounded-full px-5 py-2.5">
              <div className="w-4 h-4 border-2 border-mars/20 border-t-mars rounded-full animate-spin" />
              <p className="font-mercure text-white/40 text-sm italic">{t.loadingMars}</p>
            </div>
          </div>
        )}

        {/* Start overlay — hidden here, rendered below stage */}
        {false && !loading && !hasStarted && null}

        {/* Tap stage to advance too — but button below is primary */}
        {hasStarted && !hasEnded && (
          <div
            onClick={advanceStep}
            className="absolute inset-0 z-10 cursor-pointer"
            role="button"
            tabIndex={-1}
          />
        )}

        <svg
          className="absolute inset-0"
          width="100%"
          height="100%"
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
            <filter id="glow-author" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="0.6" result="b1" />
              <feGaussianBlur stdDeviation="1.5" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-trail" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
          </defs>

          {/* LED ring */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,85,0,0.06)" strokeWidth="3" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,85,0,0.12)" strokeWidth="0.8" filter="url(#glow-soft)" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,85,0,0.5)" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="38" fill="rgba(255,85,0,0.015)" />

          {/* Progress ring */}
          {hasStarted && !hasEnded && (
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="rgba(255,85,0,0.35)"
              strokeWidth="1"
              strokeLinecap="round"
              filter="url(#glow-soft)"
              strokeDasharray={`${progress * 264} 264`}
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dasharray 0.5s ease-out" }}
            />
          )}

          {/* Ritual ending — ring pulse */}
          {hasEnded && (
            <circle cx="50" cy="50" r="42" fill="none"
              stroke="rgba(255,85,0,0.4)" strokeWidth="0.6"
              filter="url(#glow-soft)"
            >
              <animate attributeName="strokeWidth" values="0.6;2;0.6" dur="4s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.4;0.15;0.4" dur="4s" repeatCount="indefinite" />
            </circle>
          )}

          {/* Connection lines between interacting characters */}
          {hasStarted && connectionLines.map(([a, b], lineIdx) => {
            const posA = renderPositions[a];
            const posB = renderPositions[b];
            if (!posA || !posB) return null;
            const charA = allCharacters[a];
            const isAuthorLine = charA?.description === "author" || allCharacters[b]?.description === "author";
            const lineColor = isAuthorLine
              ? "rgba(255,215,0,0.08)"
              : "rgba(255,85,0,0.06)";
            return (
              <line
                key={`conn-${lineIdx}`}
                x1={posA.x} y1={posA.y}
                x2={posB.x} y2={posB.y}
                stroke={lineColor}
                strokeWidth="0.3"
                strokeDasharray="1,1.5"
              >
                <animate attributeName="stroke-opacity" values="0;1;0" dur="3s" repeatCount="1" />
              </line>
            );
          })}

          {/* Movement trails */}
          {trails.map((trail) => {
            if (!trail) return null;
            const char = allCharacters[trail.index];
            const isAuthor = char?.description === "author";
            const isAbstract = char?.description?.toLowerCase() === "abstract";
            const trailColor = isAuthor
              ? "rgba(255,215,0,0.12)"
              : isAbstract
                ? "rgba(255,255,255,0.08)"
                : "rgba(255,85,0,0.1)";
            return (
              <line
                key={`trail-${trail.index}`}
                x1={trail.from.x} y1={trail.from.y}
                x2={trail.to.x} y2={trail.to.y}
                stroke={trailColor}
                strokeWidth="0.8"
                strokeLinecap="round"
                filter="url(#glow-trail)"
              >
                <animate attributeName="stroke-opacity" values="1;0" dur="2.5s" fill="freeze" />
              </line>
            );
          })}

          {/* Characters */}
          {(() => {
            // Pre-compute label positions with collision avoidance (vertical only — stable)
            const labelOffsets = renderPositions.map((pos) => {
              const above = pos.y < CY;
              return { x: 0, y: above ? -4.5 : 5.5, above };
            });

            // Resolve overlaps: push labels apart vertically when horizontally close
            const LABEL_MIN_DIST = 6;
            for (let pass = 0; pass < 4; pass++) {
              for (let i = 0; i < renderPositions.length; i++) {
                for (let j = i + 1; j < renderPositions.length; j++) {
                  const pi = renderPositions[i];
                  const pj = renderPositions[j];
                  const liY = pi.y + labelOffsets[i].y;
                  const ljY = pj.y + labelOffsets[j].y;
                  const dx = Math.abs(pi.x - pj.x);
                  const dy = Math.abs(liY - ljY);
                  if (dx < 18 && dy < LABEL_MIN_DIST) {
                    const push = (LABEL_MIN_DIST - dy) / 2 + 0.5;
                    if (liY < ljY) {
                      labelOffsets[i].y -= push;
                      labelOffsets[j].y += push;
                    } else {
                      labelOffsets[i].y += push;
                      labelOffsets[j].y -= push;
                    }
                  }
                }
              }
            }

            // Clamp labels inside stage ring (y 10..90)
            for (let i = 0; i < renderPositions.length; i++) {
              const absLabelY = renderPositions[i].y + labelOffsets[i].y;
              if (absLabelY < 10) labelOffsets[i].y = 10 - renderPositions[i].y;
              if (absLabelY > 90) labelOffsets[i].y = 90 - renderPositions[i].y;
            }

            return renderPositions.map((pos, i) => {
              const char = allCharacters[i];
              if (!char) return null;
              const isAuthor = char.description === "author";
              const isAbstract = !isAuthor && char.description?.toLowerCase() === "abstract";
              const isActive = hasStarted && movedCharacters.has(i);
              const dotR = isAuthor ? 2.2 : (isActive ? 2.8 : 2);

              const colors = isAuthor
                ? { fill: "rgba(255,215,0,0.6)", stroke: "rgba(255,215,0,0.7)", glow: "rgba(255,215,0,0.06)", text: "rgba(255,230,130,0.7)" }
                : isAbstract
                  ? { fill: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)", stroke: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)", glow: "rgba(255,255,255,0.03)", text: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)" }
                  : { fill: isActive ? "rgba(255,85,0,0.9)" : "rgba(255,85,0,0.55)", stroke: isActive ? "rgba(255,85,0,1)" : "rgba(255,85,0,0.65)", glow: "rgba(255,85,0,0.06)", text: isActive ? "rgba(255,179,128,1)" : "rgba(255,179,128,0.55)" };

              const labelY = labelOffsets[i].y;
              const labelAbove = labelY < 0;
              // Smart text anchor: push label inward if dot is near the edges
              const xFromCenter = pos.x - CX;
              const anchor: "start" | "middle" | "end" =
                xFromCenter > 12 ? "end" : xFromCenter < -12 ? "start" : "middle";

              return (
                <g key={i} ref={(el) => { groupRefs.current[i] = el; }} transform={`translate(${pos.x}, ${pos.y})`}>
                  {/* Glow */}
                  <circle cx={0} cy={0}
                    r={isAuthor ? 4 : (isActive ? 7 : 4)}
                    fill={colors.glow}
                    filter={isAuthor ? "url(#glow-author)" : "url(#glow-char)"}
                  />

                  {/* Dot */}
                  <circle cx={0} cy={0} r={dotR}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={isAuthor ? 0.3 : (isActive ? 0.4 : 0.2)}
                  />

                  {/* Active pulse */}
                  {isActive && !isAuthor && (
                    <circle cx={0} cy={0} r="4" fill="none"
                      stroke={isAbstract ? "rgba(255,255,255,0.2)" : "rgba(255,85,0,0.35)"}
                      strokeWidth="0.2"
                    >
                      <animate attributeName="r" values="3.5;7;3.5" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Name */}
                  <text
                    x={0} y={labelY}
                    textAnchor={anchor}
                    fill={colors.text}
                    fontSize={isAuthor ? 2.4 : (isActive ? 2.6 : 2.2)}
                    fontWeight={isAuthor ? 600 : (isActive ? 700 : 500)}
                    fontStyle={isAbstract || isAuthor ? "italic" : "normal"}
                    letterSpacing="0.03"
                    className="select-none"
                    dominantBaseline={labelAbove ? "auto" : "hanging"}
                  >
                    {char.name}
                  </text>
                </g>
              );
            });
          })()}
        </svg>
      </div>

      {/* Start button — pinned at bottom */}
      {!loading && !hasStarted && (
        <div className="shrink-0 px-5 sm:px-6 pb-5 sm:pb-6 pt-2">
          <button
            onClick={handleStart}
            className="group w-full relative cursor-pointer"
          >
            <div className="absolute -inset-2 bg-mars/15 blur-2xl rounded-2xl animate-pulse-glow pointer-events-none" />
            <div className="relative w-full py-5 rounded-2xl bg-mars group-hover:bg-mars-light transition-all duration-200 shadow-[0_4px_30px_rgba(255,85,0,0.4)] group-hover:shadow-[0_4px_40px_rgba(255,85,0,0.6)] group-active:scale-[0.97] text-center">
              <span className="text-white font-black text-base sm:text-lg uppercase tracking-[0.2em]">
                {t.startThePlay}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Narration + Controls */}
      {hasStarted && (
        <div className="relative shrink-0">
          {/* Narration — tap the whole area to advance */}
          {!hasEnded ? (
            <button
              onClick={advanceStep}
              className="w-full px-6 sm:px-10 py-5 sm:py-6 cursor-pointer active:bg-white/[0.02] transition-colors"
            >
              <p
                className={`text-white/70 text-[15px] sm:text-[17px] leading-[1.6] text-center transition-opacity duration-500 ${
                  fadeState === "fading" ? "opacity-0" : "opacity-100"
                }`}
                key={narrationStep}
              >
                {sentences[narrationStep]}
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="text-white/20 text-[10px] tabular-nums">
                  {currentStep + 1}/{sentences.length}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${
                  currentStep >= sentences.length - 1 ? "text-mars/60" : "text-white/30"
                }`}>
                  {t.tapToContinue}
                </span>
              </div>
            </button>
          ) : (
            <div className="px-8 sm:px-10 pt-5 pb-2">
              <p
                className="font-mercure italic text-mars/70 text-sm sm:text-base leading-relaxed text-center animate-fade-in"
                key="ending"
              >
                {t.stageHasSpoken}
              </p>
            </div>
          )}

          {/* End the play */}
          {hasEnded && endingPhase >= 2 && (
            <div className="px-5 sm:px-6 pb-5 animate-fade-in flex flex-col items-center gap-3">
              <button
                onClick={() => { playBell(); onEnd?.(); }}
                className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-mars/40 bg-mars/[0.06] hover:bg-mars/[0.12] hover:border-mars/60 transition-all duration-200"
              >
                <span className="text-mars font-bold text-[11px] sm:text-xs uppercase tracking-[0.2em]">
                  {t.endThePlay}
                </span>
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-mars">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                </svg>
              </button>

              <button
                onClick={handleReplay}
                className="flex items-center gap-2 text-white/25 hover:text-white/50 text-[10px] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
                  <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                </svg>
                {t.replay}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
