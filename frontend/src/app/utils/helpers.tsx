import { Vector3Simple } from "@/app/store/slices/SimulationSlice";

export const toTitleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());
};

export const calculateDistance = (
  vec1: Vector3Simple,
  vec2: Vector3Simple,
): number => {
  const dx = vec2.x - vec1.x;
  const dy = vec2.y - vec1.y;
  const dz = vec2.z - vec1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) / 1000;
};
