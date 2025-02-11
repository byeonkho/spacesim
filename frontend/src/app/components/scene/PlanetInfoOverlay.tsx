import React from "react";
import { Html } from "@react-three/drei";
import { useSelector } from "react-redux";
import {
  CelestialBody,
  selectActiveBody,
  selectDerivedOrbitingBody,
} from "@/app/store/slices/SimulationSlice";
import SimConstants from "@/app/constants/SimConstants";
import { RootState } from "@/app/store/Store";
import { calculateDistance, toTitleCase } from "@/app/utils/helpers";

const PlanetInfoOverlay = () => {
  const activeBody = useSelector(selectActiveBody);
  let distanceFromOrbitingBody: number | undefined;

  const orbitingBody = useSelector((state: RootState) =>
    activeBody
      ? (
          selectDerivedOrbitingBody as (
            // we cast to function type here as TS reads it as 1 input param otherwise; throws IDE error but compile and
            // runtime is fine
            state: RootState,
            props: { bodyName: string },
          ) => CelestialBody
        )(
          // tells TS it returns CelestialBody
          state,
          { bodyName: activeBody.name }, // call the function
        )
      : undefined,
  );

  // do not shift this return earlier; React expects all hooks to run every render
  if (!activeBody) {
    return null;
  }

  // the coordinates we pass to Drei's Html component to transform 3d -> 2d; we anchor the UI element to
  // the derived position
  const position: number[] = [
    activeBody.position.x / SimConstants.SCALE_FACTOR,
    activeBody.position.y / SimConstants.SCALE_FACTOR,
    activeBody.position.z / SimConstants.SCALE_FACTOR,
  ];

  if (activeBody && orbitingBody) {
    distanceFromOrbitingBody = calculateDistance(
      activeBody.position,
      orbitingBody.position,
    );
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
            {orbitingBody?.name && (
              <>
                Distance to {toTitleCase(orbitingBody.name)} : {""}
              </>
            )}
            {distanceFromOrbitingBody} km
          </p>
          {/*<p style={{ margin: "2px 0" }}>Relative Velocity:</p>*/}
          {/*<p style={{ margin: "2px 0" }}>*/}
          {/*  x: {activeBody.velocity.x.toFixed(2)} km/s*/}
          {/*</p>*/}
          {/*<p style={{ margin: "2px 0" }}>*/}
          {/*  y: {activeBody.velocity.y.toFixed(2)} km/s*/}
          {/*</p>*/}
          {/*<p style={{ margin: "2px 0" }}>*/}
          {/*  z: {activeBody.velocity.z.toFixed(2)} km/s*/}
          {/*</p>*/}
        </div>
      </div>
    </Html>
  );
};

export default PlanetInfoOverlay;
