"use client";

/**
 * @author: @kokonutui (adapted for Inner Margins Retro Theme)
 * @description: Apple Activity Card - Retro Themed Edition
 * @version: 1.1.0
 * @license: MIT
 * @website: https://kokonutui.com
 */

import {
  animate,
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { type CSSProperties, useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ActivityData {
  label: string;
  color: string;
  colorEnd: string;
  size: number;
  /** Can go past `target`: the ring keeps going for another lap. */
  current: number;
  target: number;
  unit: string;
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const STROKE = 16;
// Rings draw one after another, this far apart (s).
const STAGGER = 0.18;
// Time for the first lap; anything past the goal adds up to OVER_S more.
const DRAW_S = 1.2;
const OVER_S = 0.6;
// More than three laps would just be a solid ring.
const MAX_LAPS = 3;

export const RETRO_SAMPLE_ACTIVITIES: ActivityData[] = [
  {
    label: "WEEKLY CYCLES",
    color: "#C9413C",      // Retro Crimson Primary
    colorEnd: "#E2554F",   // Retro Coral Border
    size: 200,
    current: 5,
    target: 7,
    unit: "LOGS",
  },
  {
    label: "MONTHLY CADENCE",
    color: "#D96B43",      // Warm Terracotta
    colorEnd: "#F08C68",   // Soft Terracotta
    size: 160,
    current: 18,
    target: 20,
    unit: "LOGS",
  },
  {
    label: "ACTIVE STREAK",
    color: "#C88A2E",      // Vintage Amber / Ochre Gold
    colorEnd: "#E8B058",   // Warm Gold
    size: 120,
    current: 12,
    target: 14,
    unit: "DAYS",
  },
];

/** Progress in laps (1 = goal), capped so a huge value stays legible. */
const ratioOf = (data: ActivityData) =>
  data.target > 0
    ? Math.min(Math.max(data.current / data.target, 0), MAX_LAPS)
    : 0;

/** Duration of one ring's draw; its count-up runs on the same clock. */
const drawSeconds = (ratio: number) =>
  DRAW_S + OVER_S * Math.min(Math.max(ratio - 1, 0), 1);

interface RingNodes {
  base: SVGCircleElement | null;
  lap: SVGCircleElement | null;
  cap: SVGGElement | null;
  pulse: SVGCircleElement | null;
  count: HTMLSpanElement | null;
}

/**
 * Write one frame of a ring's draw straight to the DOM: `p` is progress in
 * laps. Past the goal the first lap stays full and a second circle draws
 * the overflow on top of it, led by a shadowed end cap.
 */
function paintRing(
  nodes: RingNodes,
  data: Pick<ActivityData, "size" | "current">,
  p: number,
  ratio: number
) {
  const radius = (data.size - STROKE) / 2;
  const circumference = radius * 2 * Math.PI;
  nodes.base?.setAttribute(
    "stroke-dashoffset",
    `${(1 - Math.min(p, 1)) * circumference}`
  );
  const over = p > 1;
  // How far into the latest lap; a whole number of laps is a full lap.
  const rest = over ? p - Math.floor(p) || 1 : 0;
  if (nodes.lap) {
    nodes.lap.setAttribute(
      "stroke-dashoffset",
      `${(1 - rest) * circumference}`
    );
    nodes.lap.style.opacity = over ? "1" : "0";
  }
  if (nodes.cap) {
    nodes.cap.style.transform = `rotate(${rest * 360}deg)`;
    nodes.cap.style.opacity = over ? "1" : "0";
  }
  if (nodes.count) {
    // Count in step with the ring, landing exactly on the real value.
    nodes.count.textContent =
      p >= ratio
        ? `${data.current}`
        : `${Math.round((p / ratio) * data.current)}`;
  }
}

function CircleProgress({
  data,
  index,
  inView,
  reduceMotion,
  dimmed,
  onActive,
  getCountElement,
}: {
  data: ActivityData;
  index: number;
  inView: boolean;
  reduceMotion: boolean;
  dimmed: boolean;
  onActive: (active: boolean) => void;
  getCountElement: () => HTMLSpanElement | null;
}) {
  const radius = (data.size - STROKE) / 2;
  const circumference = radius * 2 * Math.PI;
  const center = data.size / 2;
  const ratio = ratioOf(data);
  const progressLabel = `${data.label}: ${data.current} of ${data.target} ${data.unit}, ${Math.round(ratio * 100)}%`;

  const gradientId = useId();
  const shadowId = useId();
  const nodes = useRef<RingNodes>({
    base: null,
    lap: null,
    cap: null,
    pulse: null,
    count: null,
  });

  // Where the ring last stood, so new values carry on from there instead of
  // redrawing from empty. Null until the first draw.
  const shown = useRef<number | null>(null);
  const { size, current } = data;

  useEffect(() => {
    if (!inView) {
      return;
    }
    const ringNodes = { ...nodes.current, count: getCountElement() };
    const ring = { size, current };
    if (reduceMotion || ratio === 0) {
      paintRing(ringNodes, ring, ratio, ratio);
      shown.current = ratio;
      return;
    }
    const from = shown.current;
    if (from === null) {
      paintRing(ringNodes, ring, 0, ratio);
    }
    let pulsed = (from ?? 0) >= 1;
    const controls = animate(from ?? 0, ratio, {
      duration: drawSeconds(ratio),
      delay: from === null ? index * STAGGER : 0,
      ease: EASE_OUT,
      onUpdate: (p) => {
        shown.current = p;
        paintRing(ringNodes, ring, p, ratio);
        if (!pulsed && p >= 1) {
          pulsed = true;
          ringNodes.pulse?.animate(
            [
              { transform: "scale(1)", opacity: 0.6 },
              { transform: "scale(2.4)", opacity: 0 },
            ],
            { duration: 560, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
          );
        }
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, size, current, ratio, index, getCountElement]);

  return (
    <motion.div
      animate={inView ? { opacity: 1, transform: "scale(1)" } : undefined}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, transform: "scale(0.96)" }}
      transition={{ duration: 0.3, delay: index * STAGGER, ease: EASE_OUT }}
    >
      <svg
        aria-label={progressLabel}
        className={cn(
          "-rotate-90 overflow-visible rounded-full outline-none transition-opacity duration-200 ease-out focus-visible:ring-2 focus-visible:ring-retro-primary",
          dimmed && "opacity-25"
        )}
        height={data.size}
        onBlur={() => onActive(false)}
        onFocus={() => onActive(true)}
        role="img"
        style={
          { "--ring": data.color, "--ring-end": data.colorEnd } as CSSProperties
        }
        tabIndex={0}
        viewBox={`0 0 ${data.size} ${data.size}`}
        width={data.size}
      >
        <title>{progressLabel}</title>
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: data.color }} />
            <stop offset="100%" style={{ stopColor: data.colorEnd }} />
          </linearGradient>
          <filter height="300%" id={shadowId} width="300%" x="-100%" y="-100%">
            <feDropShadow
              dx="0"
              dy="1"
              floodColor="#C9413C"
              floodOpacity="0.35"
              stdDeviation="2"
            />
          </filter>
        </defs>

        {/* Retro themed track */}
        <circle
          className="text-retro-border/20"
          cx={center}
          cy={center}
          fill="none"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") {
              onActive(true);
            }
          }}
          onPointerLeave={() => onActive(false)}
          pointerEvents="stroke"
          r={radius}
          stroke="currentColor"
          strokeWidth={STROKE}
        />
        <circle
          cx={center}
          cy={center}
          fill="none"
          pointerEvents="none"
          r={radius}
          ref={(node) => {
            nodes.current.base = node;
          }}
          stroke={`url(#${gradientId})`}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          strokeWidth={STROKE}
        />
        <circle
          cx={center}
          cy={center}
          fill="none"
          pointerEvents="none"
          r={radius}
          ref={(node) => {
            nodes.current.lap = node;
          }}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          strokeWidth={STROKE}
          style={{ opacity: 0, stroke: data.colorEnd }}
        />
        {/* End cap of the overflow lap */}
        <g
          pointerEvents="none"
          ref={(node) => {
            nodes.current.cap = node;
          }}
          style={{
            opacity: 0,
            transformBox: "view-box",
            transformOrigin: "center",
          }}
        >
          <circle
            cx={center + radius}
            cy={center}
            filter={`url(#${shadowId})`}
            r={STROKE / 2}
            style={{ fill: data.colorEnd }}
          />
        </g>
        {/* Goal pulse */}
        <circle
          cx={center + radius}
          cy={center}
          fill="none"
          pointerEvents="none"
          r={STROKE / 2}
          ref={(node) => {
            nodes.current.pulse = node;
          }}
          strokeWidth={2}
          style={{
            opacity: 0,
            stroke: data.colorEnd,
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        />
      </svg>
    </motion.div>
  );
}

function DetailedActivityInfo({
  activities,
  inView,
  active,
  onActive,
  onRegisterCountRef,
}: {
  activities: ActivityData[];
  inView: boolean;
  active: number | null;
  onActive: (index: number | null) => void;
  onRegisterCountRef: (index: number, node: HTMLSpanElement | null) => void;
}) {
  return (
    <motion.ul
      animate={
        inView ? { opacity: 1, transform: "translateX(0px)" } : undefined
      }
      className="flex flex-col gap-6 flex-1 min-w-[200px]"
      initial={{ opacity: 0, transform: "translateX(16px)" }}
      transition={{ duration: 0.5, delay: 0.3, ease: EASE_OUT }}
    >
      {activities.map((activity, index) => (
        <li
          className={cn(
            "flex flex-col transition-opacity duration-200 ease-out border-l-2 pl-4 py-1",
            active !== null && active !== index && "opacity-35"
          )}
          key={activity.label}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") {
              onActive(index);
            }
          }}
          onPointerLeave={() => onActive(null)}
          style={{ borderColor: activity.color }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-none inline-block shrink-0"
              style={{ backgroundColor: activity.color }}
            />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-retro-text/70">
              {activity.label}
            </span>
          </div>

          <span className="font-heading text-2xl lg:text-3xl tabular-nums text-retro-text">
            <span className="sr-only">
              {activity.current} of {activity.target} {activity.unit}
            </span>
            <span aria-hidden="true" className="flex items-baseline gap-1">
              <span
                ref={(node) => {
                  onRegisterCountRef(index, node);
                }}
                style={{ color: activity.color }}
              >
                {activity.current}
              </span>
              <span className="font-mono text-sm text-retro-text/40">
                /{activity.target}
              </span>
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-retro-text/60 ml-1">
                {activity.unit}
              </span>
            </span>
          </span>
        </li>
      ))}
    </motion.ul>
  );
}

export default function AppleActivityCard({
  title = "Telemetry Rings",
  titleAs = "h2",
  activities = RETRO_SAMPLE_ACTIVITIES,
  className,
}: {
  title?: string;
  /** Heading level for the title, to fit the page outline. */
  titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Rings, outermost first. Defaults to sample data. */
  activities?: ActivityData[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Heading = motion[titleAs];
  const boxSize = activities.length
    ? Math.max(...activities.map((activity) => activity.size))
    : 0;
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion() ?? false;
  const [active, setActive] = useState<number | null>(null);

  // Store references to count elements without accessing refs during render
  const countElements = useRef<(HTMLSpanElement | null)[]>([]);
  const handleRegisterCountRef = useCallback((index: number, node: HTMLSpanElement | null) => {
    countElements.current[index] = node;
  }, []);

  const getCountElement = useCallback((index: number) => {
    return countElements.current[index] ?? null;
  }, []);

  return (
    <div
      className={cn(
        "@container relative w-full border border-retro-border/30 bg-retro-surface/50 p-6 lg:p-8 shadow-retro-sm transition-shadow hover:shadow-retro",
        "text-retro-text font-body",
        className
      )}
      ref={ref}
    >
      <div className="flex items-center justify-between border-b border-retro-border/20 pb-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-none bg-retro-primary animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-retro-text/60">
            Cadence Diagnostics // Telemetry
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-widest uppercase text-retro-text/40 hidden sm:inline-block">
          [ Rings Active ]
        </span>
      </div>

      {/* Reduced motion keeps the fades and drops the scale/slide. */}
      <MotionConfig reducedMotion="user">
        <div className="flex flex-col items-center gap-8">
          <Heading
            animate={
              inView ? { opacity: 1, transform: "translateY(0px)" } : undefined
            }
            className="font-heading text-xl lg:text-2xl uppercase tracking-tight text-retro-text self-start"
            initial={{ opacity: 0, transform: "translateY(-12px)" }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            {title}
          </Heading>

          <div className="flex @md:flex-row flex-col items-center justify-around gap-12 w-full">
            <div
              className="relative shrink-0"
              style={{ width: boxSize, height: boxSize }}
            >
              {activities.map((activity, index) => (
                <CircleProgress
                  data={activity}
                  dimmed={active !== null && active !== index}
                  getCountElement={() => getCountElement(index)}
                  index={index}
                  inView={inView}
                  key={activity.label}
                  onActive={(on) =>
                    setActive((prev) => {
                      if (on) {
                        return index;
                      }
                      return prev === index ? null : prev;
                    })
                  }
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
            <DetailedActivityInfo
              active={active}
              activities={activities}
              inView={inView}
              onActive={setActive}
              onRegisterCountRef={handleRegisterCountRef}
            />
          </div>
        </div>
      </MotionConfig>
    </div>
  );
}
