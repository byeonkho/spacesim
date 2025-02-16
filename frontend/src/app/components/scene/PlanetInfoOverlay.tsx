import React from "react";
import { Html } from "@react-three/drei";
import { useSelector } from "react-redux";
import {
  CelestialBody,
  CelestialBodyProperties,
  selectActiveBody,
  selectCelestialBodyPropertiesList,
  selectCurrentSimulationSnapshot,
  selectIsBodyActive,
  Vector3Simple,
} from "@/app/store/slices/SimulationSlice";
import SimConstants, { bodyProperties } from "@/app/constants/SimConstants";

import {
  calculateDistance,
  calculateMagnitude,
  formatToKM,
  scaleDistance,
  subtractVectors,
  toTitleCase,
} from "@/app/utils/helpers";

const PlanetInfoOverlay = () => {
  const activeBody: CelestialBody = useSelector(selectActiveBody);
  const isBodyActive: boolean = useSelector(selectIsBodyActive);
  const simulationSnapshot: CelestialBody[] = useSelector(
    selectCurrentSimulationSnapshot,
  );
  const celestialBodyPropertiesList: CelestialBodyProperties[] | undefined =
    useSelector(selectCelestialBodyPropertiesList);

  let distanceFromOrbitingBody: string;
  let relativeVelocity: number;
  let position: number[];

  // do not shift this return earlier; React expects all hooks to run every render
  if (!activeBody || !isBodyActive) {
    return null;
  }

  // get the orbiting body and active body from single source of truth
  const orbitingBodyName: string | undefined =
    celestialBodyPropertiesList?.find(
      (body: CelestialBodyProperties) =>
        activeBody.name.trim().toUpperCase() === body.name.trim().toUpperCase(),
    )?.orbitingBody;

  const orbitingBodySnapshot: CelestialBody | undefined =
    simulationSnapshot.find(
      (body: CelestialBody) =>
        body.name.trim().toUpperCase() ===
        orbitingBodyName.trim().toUpperCase(),
    );
  const activeBodySnapshot: CelestialBody | undefined = simulationSnapshot.find(
    (body: CelestialBody) =>
      body.name.trim().toUpperCase() === activeBody.name.trim().toUpperCase(),
  );

  // the coordinates we pass to Drei's Html component to transform 3d -> 2d; we anchor the UI element to
  // the derived position
  if (
    bodyProperties[activeBody.name.toUpperCase()].positionScale != 1 &&
    activeBodySnapshot &&
    orbitingBodySnapshot
  ) {
    // if position requires scaling (e.g Moon)
    const scaled: Vector3Simple = scaleDistance(
      activeBodySnapshot.position,
      orbitingBodySnapshot.position,
      bodyProperties[activeBody.name.toUpperCase()].positionScale,
    );
    position = [
      scaled.x / SimConstants.SCALE_FACTOR,
      scaled.y / SimConstants.SCALE_FACTOR,
      scaled.z / SimConstants.SCALE_FACTOR,
    ];
  } else {
    position = [
      activeBody.position.x / SimConstants.SCALE_FACTOR,
      activeBody.position.y / SimConstants.SCALE_FACTOR,
      activeBody.position.z / SimConstants.SCALE_FACTOR,
    ];
  }

  if (activeBodySnapshot && orbitingBodySnapshot) {
    distanceFromOrbitingBody = calculateDistance(
      activeBodySnapshot.position,
      orbitingBodySnapshot.position,
      "AU", // TODO make this dynamic for future
    );

    const velocityDelta = subtractVectors(
      activeBodySnapshot.velocity,
      orbitingBodySnapshot.velocity,
    );
    relativeVelocity = calculateMagnitude(velocityDelta);
  }

  // Divider dimensions (in pixels)
  const diagonalLength: number = 20;
  const horizontalLength: number = 200;
  // Total width is the length of the divider (diagonal plus horizontal)
  const totalWidth: number = diagonalLength + horizontalLength;
  // Total height: we leave extra vertical space below the divider for the velocity info.
  const totalHeight: number = diagonalLength;

  return (
    <Html position={position} style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "relative",
          width: totalWidth,
          height: totalHeight,
        }}
      >
        {/* SVG divider */}
        <svg
          width={totalWidth}
          height={totalHeight}
          style={{ position: "absolute", left: 0, bottom: 0 }}
        >
          {/* Diagonal segment: from the anchor (bottom left) up to the start of the horizontal line */}
          <line
            x1="0"
            y1={totalHeight}
            x2={diagonalLength}
            y2={totalHeight - diagonalLength}
            stroke="white"
            strokeWidth="3"
          />
          {/* Horizontal segment: from end of the diagonal to the right */}
          <line
            x1={diagonalLength}
            y1={totalHeight - diagonalLength}
            x2={totalWidth}
            y2={totalHeight - diagonalLength}
            stroke="white"
            strokeWidth="6"
          />
        </svg>

        {/* Body name container: positioned above the horizontal line */}
        <div
          style={{
            position: "absolute",
            left: diagonalLength * 1.5,
            bottom: totalHeight, // aligns with the horizontal line
            width: horizontalLength,
            textAlign: "left",
            color: "white",
            fontWeight: "bold",
            // Optionally adjust font size as needed:
            fontSize: "2em",
          }}
        >
          {activeBody.name}
        </div>

        {/* Velocity info container: positioned below the horizontal line */}
        <div
          style={{
            position: "absolute",
            left: diagonalLength * 1.5,
            top: totalHeight, // starts at the horizontal line
            width: horizontalLength,
            textAlign: "left",
            color: "white",
            fontSize: "0.9em",
            lineHeight: "1.2em",
          }}
        >
          <p style={{ margin: "2px 0" }}>
            {orbitingBodySnapshot?.name && (
              <>
                Distance to {toTitleCase(orbitingBodySnapshot.name)}: {""}
              </>
            )}
            {distanceFromOrbitingBody}
          </p>
          <p style={{ margin: "2px 0" }}>Relative Velocity:</p>
          {formatToKM(relativeVelocity)}
        </div>
      </div>
    </Html>
  );
};

export default PlanetInfoOverlay;
