"use client";

import { Play } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  play: Play;
  index?: number;
};

export default function PlayCard({ play, index }: Props) {
  const { t } = useI18n();

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-orange-500/30 transition-colors">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            {index !== undefined && (
              <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                {t.option} {index + 1}
              </span>
            )}
            <h3 className="text-xl font-bold text-white mt-1">{play.name}</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span>{play.duration}</span>
            <span>
              {play.playerCount.min}-{play.playerCount.max} {t.players}
            </span>
          </div>
        </div>

        {/* Mood */}
        <div className="text-sm text-orange-300/70 italic">{play.mood}</div>

        {/* 4 Components */}
        <div className="space-y-4">
          <Section label={t.theImage} color="orange">
            {play.image}
          </Section>
          <Section label={t.characters} color="blue">
            {play.characters}
          </Section>
          <Section label={t.authorsRole} color="green">
            {play.authorRole}
          </Section>
          <Section label={t.endingPerspective} color="purple">
            {play.endingPerspective}
          </Section>
        </div>

        {/* Simulation Scenario */}
        {play.simulation && (
          <div className="mt-6 rounded-lg border-2 border-dashed border-orange-500/30 bg-orange-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                ▶ {t.simulationTitle}
              </span>
              <span className="text-xs text-white/30 italic">
                {t.simulationSub}
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed italic font-light">
              {play.simulation}
            </p>
          </div>
        )}

        {/* Perspectives */}
        {play.perspectives && play.perspectives.length > 0 && (
          <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-5">
            <div className="mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                💡 {t.perspectivesTitle}
              </span>
            </div>
            <div className="space-y-3">
              {play.perspectives.map((p, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-orange-400 font-bold text-sm mt-0.5">{i + 1}.</span>
                  <p className="text-white/70 text-sm leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  label,
  color,
  children,
}: {
  label: string;
  color: "orange" | "blue" | "green" | "purple";
  children: React.ReactNode;
}) {
  const colors = {
    orange: "border-orange-500/30 bg-orange-500/5",
    blue: "border-blue-500/30 bg-blue-500/5",
    green: "border-green-500/30 bg-green-500/5",
    purple: "border-purple-500/30 bg-purple-500/5",
  };

  const labelColors = {
    orange: "text-orange-400",
    blue: "text-blue-400",
    green: "text-green-400",
    purple: "text-purple-400",
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <div className="mb-2">
        <span
          className={`text-xs font-bold uppercase tracking-wider ${labelColors[color]}`}
        >
          {label}
        </span>
      </div>
      <p className="text-white/80 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
