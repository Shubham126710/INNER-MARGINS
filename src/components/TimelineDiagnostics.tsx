"use client";

import { useState } from "react";
import { ContributionGraph } from "./ContributionGraph";
import ActivityTerrain, { type TerrainCell } from "./kokonutui/activity-terrain";
import { cn } from "@/lib/utils";

interface TimelineDiagnosticsProps {
  data: { [date: string]: number };
  className?: string;
}

export function TimelineDiagnostics({ data, className }: TimelineDiagnosticsProps) {
  const [viewMode, setViewMode] = useState<"flat" | "3d">("flat");
  const [activeCell, setActiveCell] = useState<TerrainCell | null>(null);

  const readout = activeCell
    ? `${activeCell.count} ${activeCell.count === 1 ? "log entry" : "log entries"} on ${activeCell.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })}`
    : viewMode === "3d"
      ? "Timeframe: 365 Cycles // 3D Isometric View"
      : "Timeframe: 365 Cycles // Telemetry";

  return (
    <div
      className={cn(
        "relative z-10 mb-16 border border-retro-border/30 bg-retro-surface/50 p-6 lg:p-8 shadow-retro-sm hover:shadow-retro transition-shadow overflow-hidden animate-fade-in opacity-0",
        className
      )}
      style={{ animationDelay: "700ms", animationFillMode: "forwards" }}
    >
      {/* Diagnostics Header & Single Unified Mode Switcher */}
      <div className="border-b border-retro-border/20 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-none bg-retro-primary animate-pulse" />
            <h2 className="text-xl lg:text-2xl font-heading uppercase tracking-tight text-retro-text">
              Timeline Diagnostics
            </h2>
          </div>
          <p className="font-mono text-[10px] tracking-widest text-retro-text/60 uppercase">
            {readout}
          </p>
        </div>

        {/* View Switcher Controls - Single Clean Toggle */}
        <div className="flex border border-retro-border/30 bg-retro-bg/60 p-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setViewMode("flat");
              setActiveCell(null);
            }}
            className={cn(
              "px-3 py-1 text-[10px] sm:text-xs uppercase tracking-wider transition-colors outline-none cursor-pointer",
              viewMode === "flat"
                ? "bg-retro-primary text-retro-surface font-bold shadow-retro-sm"
                : "text-retro-text/70 hover:text-retro-text hover:bg-retro-surface/80"
            )}
          >
            [ 2D MATRIX ]
          </button>
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={cn(
              "px-3 py-1 text-[10px] sm:text-xs uppercase tracking-wider transition-colors outline-none cursor-pointer",
              viewMode === "3d"
                ? "bg-retro-primary text-retro-surface font-bold shadow-retro-sm"
                : "text-retro-text/70 hover:text-retro-text hover:bg-retro-surface/80"
            )}
          >
            [ 3D TERRAIN ]
          </button>
        </div>
      </div>

      {/* Viewport: Flat (Default) vs 3D Isometric Terrain */}
      {viewMode === "flat" ? (
        <ContributionGraph data={data} />
      ) : (
        <ActivityTerrain
          data={data}
          defaultFlat={false}
          showHeader={false}
          showFooter={true}
          onActiveChange={setActiveCell}
          className="border-0 bg-transparent p-0 shadow-none hover:shadow-none"
        />
      )}
    </div>
  );
}

export default TimelineDiagnostics;
