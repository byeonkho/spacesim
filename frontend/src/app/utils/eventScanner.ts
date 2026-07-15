import type { EventSeverity } from "@/app/store/slices/EventLogSlice";

export type EventType = "closestApproach" | "perihelion" | "aphelion";

export interface DetectedEvent {
  type: EventType;
  timeIndex: number;
  bodies: string[];
  severity: EventSeverity;
  magnitude: number;
  message: string;
}

export const MIN_PROMINENCE_FRACTION = 0.15;
export const WARN_PROMINENCE_FRACTION = 0.5;
export const REFINE_SUBSTEPS = 8;

function displayName(name: string): string {
  if (name.length === 0) return name;
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}

export function describeApproach(
  bodies: [string, string],
  isoDate: string,
): string {
  const [a, b] = bodies.map(displayName);
  const date = isoDate ? isoDate.slice(0, 10) : "";
  return date
    ? `${a} is closest to ${b} on ${date}`
    : `${a} is closest to ${b}`;
}

export function describePerihelion(
  body: string,
  isoDate: string,
  kind: "perihelion" | "aphelion",
): string {
  const name = displayName(body);
  const date = isoDate ? isoDate.slice(0, 10) : "";
  const phrase =
    kind === "perihelion"
      ? "is nearest the Sun"
      : "is farthest from the Sun";
  return date ? `${name} ${phrase} on ${date}` : `${name} ${phrase}`;
}
