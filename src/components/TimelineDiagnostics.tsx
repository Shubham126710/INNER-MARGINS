"use client";

import { useState } from "react";
import { ContributionGraph } from "./ContributionGraph";
import ActivityTerrain from "./kokonutui/activity-terrain";
import { cn } from "@/lib/utils";

interface TimelineDiagnosticsProps {
  data: { [date: string]: number };
  className?: string;
}

export function TimelineDiagnostics({ data, className }: TimelineDiagnosticsProps) {
  const [viewMode, setViewMode] = useState<"flat" | "3d">("flat");

  return (
    <div
      className={cn(
        "relative z-10 mb-16 border border-retro-border/30 bg-retro-surface/50 p-6 lg:p-8 shadow-retro-sm hover:shadow-retro transition-shadow overflow-hidden animate-fade-in opacity-0",
        className
      )}
      style={{ animationDelay: "700ms", animationFillMode: "forwards" }}
    >
      {/* Diagnostics Header & Mode Switcher */}
      <div className="border-b border-retro-border/20 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-none bg-retro-primary animate-pulse" />
            <h2 className="text-xl lg:text-2xl font-heading uppercase tracking-tight text-retro-text">
              Timeline Diagnostics
            </h2>
          </div>
          <p className="font-mono text-[10px] tracking-widest text-retro-text/60 uppercase">
            Timeframe: 365 Cycles // Telemetry
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2">
          <div className="flex border border-retro-border/30 bg-retro-bg/60 p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode("flat")}
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
                "px-3 py-1 text-[10px] sm:text-xs uppercase tracking-wider transition-colors outline-none flex items-center gap-1.5 cursor-pointer",
                viewMode === "3d"
                  ? "bg-retro-primary text-retro-surface font-bold shadow-retro-sm"
                  : "text-retro-text/70 hover:text-retro-text hover:bg-retro-surface/80"
              )}
            >
              <span>[ 3D TERRAIN ]</span>
              {viewMode !== "3d" && (
                <span className="text-[9px] px-1 bg-retro-primary/10 text-retro-primary font-bold">
                  EXPAND
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Viewport: Flat (Default) vs 3D Isometric Terrain */}
      {viewMode === "flat" ? (
        <div>
          <ContributionGraph data={data} />

          {/* Option to Expand into 3D Terrain */}
          <div className="mt-4 pt-4 border-t border-retro-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-retro-text/70">
              <span className="inline-block w-1.5 h-1.5 bg-retro-primary animate-pulse" />
              <span>3D ISOMETRIC TOPOLOGY ENGINE AVAILABLE</span>
            </div>
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className="px-3 py-1.5 border border-retro-border/40 bg-retro-surface/80 hover:bg-retro-primary hover:text-retro-surface text-retro-text text-[11px] font-mono uppercase tracking-wider transition-all shadow-retro-sm flex items-center gap-2 group cursor-pointer"
            >
              <span>Expand to 3D Terrain</span>
              <span className="text-xs transition-transform group-hover:translate-x-0.5">⤢</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ActivityTerrain
            data={data}
            defaultFlat={false}
            title="Isometric Activity Terrain"
            className="border-0 bg-transparent p-0 shadow-none hover:shadow-none"
          />
          <div className="pt-2 border-t border-retro-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
            <span className="text-[10px] text-retro-text/60 uppercase tracking-widest">
              [ Interactive 3D Canvas • Drag/Flick to Orbit • Hover to Elevate ]
            </span>
            <button
              type="button"
              onClick={() => setViewMode("flat")}
              className="text-[11px] font-mono text-retro-text hover:underline uppercase tracking-wider cursor-pointer"
            >
              ← Collapse to 2D Matrix
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimelineDiagnostics;
