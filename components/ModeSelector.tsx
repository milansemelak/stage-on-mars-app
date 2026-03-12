"use client";

import { Mode } from "@/lib/types";

type Props = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

export default function ModeSelector({ mode, onChange }: Props) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-white/20">
      <button
        onClick={() => onChange("guide")}
        className={`px-5 py-2.5 text-sm font-medium transition-colors ${
          mode === "guide"
            ? "bg-orange-500 text-white"
            : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
        }`}
      >
        Facilitator Mode
        <span className="block text-xs opacity-70 mt-0.5">3 play options</span>
      </button>
      <button
        onClick={() => onChange("self-service")}
        className={`px-5 py-2.5 text-sm font-medium transition-colors ${
          mode === "self-service"
            ? "bg-orange-500 text-white"
            : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
        }`}
      >
        Self-service
        <span className="block text-xs opacity-70 mt-0.5">1 detailed play</span>
      </button>
    </div>
  );
}
