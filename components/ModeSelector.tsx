"use client";

import { Mode } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

export default function ModeSelector({ mode, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="flex w-full rounded-lg overflow-hidden border border-white/20">
      <button
        onClick={() => onChange("guide")}
        className={`flex-1 px-5 py-3 text-sm font-medium transition-colors ${
          mode === "guide"
            ? "bg-orange-500 text-white"
            : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
        }`}
      >
        {t.facilitatorMode}
        <span className="block text-xs opacity-70 mt-0.5">{t.facilitatorSub}</span>
      </button>
      <button
        onClick={() => onChange("self-service")}
        className={`flex-1 px-5 py-3 text-sm font-medium transition-colors ${
          mode === "self-service"
            ? "bg-orange-500 text-white"
            : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
        }`}
      >
        {t.selfService}
        <span className="block text-xs opacity-70 mt-0.5">{t.selfServiceSub}</span>
      </button>
    </div>
  );
}
