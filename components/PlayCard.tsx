"use client";

import { Play } from "@/lib/types";

type Props = {
  play: Play;
  index?: number;
};

export default function PlayCard({ play, index }: Props) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-orange-500/30 transition-colors">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            {index !== undefined && (
              <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                Option {index + 1}
              </span>
            )}
            <h3 className="text-xl font-bold text-white mt-1">{play.name}</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span>{play.duration}</span>
            <span>
              {play.playerCount.min}-{play.playerCount.max} players
            </span>
          </div>
        </div>

        {/* Mood */}
        <div className="text-sm text-orange-300/70 italic">{play.mood}</div>

        {/* 4 Components */}
        <div className="space-y-4">
          <Section label="The Image" color="orange">
            {play.image}
          </Section>
          <Section label="Characters" color="blue">
            {play.characters}
          </Section>
          <Section label="Author's Role" color="green">
            {play.authorRole}
          </Section>
          <Section label="Ending Perspective" color="purple">
            {play.endingPerspective}
          </Section>
        </div>
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
