import { Vector3Simple } from "@/app/store/slices/SimulationSlice";
import MathConstants from "@/app/constants/MathConstants";
import * as THREE from "three";

export const toTitleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());
};

export const calculateDistance = (
  vec1: Vector3Simple,
  vec2: Vector3Simple,
  unit: string,
): string => {
  const dx = vec2.x - vec1.x;
  const dy = vec2.y - vec1.y;
  const dz = vec2.z - vec1.z;

  const result = Math.sqrt(dx * dx + dy * dy + dz * dz);

  if (unit === "KM") {
    const km: number = result / MathConstants.METRES_TO_KM;
    // Format km as an integer with locale-specific separators
    return Math.round(km).toLocaleString("en-US") + " km";
  } else if (unit === "AU") {
    const au: number = result / MathConstants.METRES_TO_AU;
    const roundedAU: number = Math.round(au * 100) / 100; // Rounded to two decimal places
    if (roundedAU === 0) {
      // Fallback: show km instead if AU is too small
      const km: number = result / MathConstants.METRES_TO_KM;
      return Math.round(km).toLocaleString("en-US") + " km";
    }
    // Format AU with two decimal places and locale-specific separators
    return (
      roundedAU.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " AU"
    );
  }
  // Fallback: if no valid unit is provided, return meters formatted with locale-specific separators.
  return result.toLocaleString("en-US") + " m";
};

export const subtractVectors = (
  a: Vector3Simple,
  b: Vector3Simple,
): Vector3Simple => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };
};

export const calculateMagnitude = (v: Vector3Simple): number => {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};

export const formatToKM = (n: number): string => {
  const km = n / 1000;
  return (
    km.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " km/s"
  );
};

export const roundToTwoDecimals = (value: number): number => {
  return Math.round(value * 10) / 10;
};

export function scaleDistance(
  primary: Vector3Simple,
  orbiting: Vector3Simple,
  scaleFactor: number,
): Vector3Simple {
  // Convert simple vectors to THREE.Vector3.
  const primaryVec = toTHREE(primary);
  const orbitingVec = toTHREE(orbiting);

  // Compute the relative vector from the orbiting body to the primary body.
  const relative = primaryVec.clone().sub(orbitingVec);
  // Scale that relative vector.
  relative.multiplyScalar(scaleFactor);
  // Compute the new position by adding the scaled relative vector to the orbiting body's position.
  const newPosition = orbitingVec.clone().add(relative);

  // Convert the result back to your simple vector format.
  return toSimple(newPosition);
}

// Convert a simple vector to a THREE.Vector3.
const toTHREE = (v: Vector3Simple): THREE.Vector3 =>
  new THREE.Vector3(v.x, v.y, v.z);

// Convert a THREE.Vector3 back to a simple vector.
const toSimple = (v: THREE.Vector3): Vector3Simple => ({
  x: v.x,
  y: v.y,
  z: v.z,
});
