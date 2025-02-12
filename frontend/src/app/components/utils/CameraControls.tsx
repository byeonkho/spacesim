import React, { useEffect, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three-stdlib";
import { useSelector } from "react-redux";
import {
  CelestialBody,
  selectActiveBody,
  selectIsBodyActive,
  selectBodyRadiusFromName,
} from "@/app/store/slices/SimulationSlice";
import * as THREE from "three";
import SimConstants from "@/app/constants/SimConstants";
import { RootState } from "@/app/store/Store";

extend({ OrbitControls });

const CameraControls: React.FC = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls>(null!);
  const activeBody: CelestialBody = useSelector(selectActiveBody);
  const isBodyActive: boolean = useSelector(selectIsBodyActive);
  let radius: number | undefined;

  // Retrieve the active body's radius (if active), then scale it.
  radius =
    useSelector((state: RootState): number | undefined =>
      activeBody && isBodyActive
        ? (
            selectBodyRadiusFromName as (
              state: RootState,
              props: { bodyName: string },
            ) => number
          )(state, { bodyName: activeBody.name })
        : undefined,
    )! / SimConstants.RADIUS_SCALE_FACTOR;

  // Create a ref for the tracking zoom level.
  // Initially, use a value computed from the radius if available, or fall back to the current camera distance.
  const trackingZoomRef = useRef<number>(
    radius
      ? radius * 1
      : camera.position.distanceTo(
          controlsRef.current?.target || new THREE.Vector3(),
        ),
  );

  // Optionally, add an event listener to update the tracking zoom based on mouse scroll.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      console.log("zoom level: ", trackingZoomRef.current);
      e.preventDefault(); // Prevent page scroll.
      // Update the zoom level: if e.deltaY > 0, zoom out; if e.deltaY < 0, zoom in.
      // Here we adjust trackingZoomRef by a small factor per wheel event.
      trackingZoomRef.current *= 1 + e.deltaY * 0.001;
      // Optionally, clamp to a minimum and maximum value.
      trackingZoomRef.current = THREE.MathUtils.clamp(
        trackingZoomRef.current,
        1,
        1e6,
      );
    };

    gl.domElement.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      gl.domElement.removeEventListener("wheel", onWheel);
    };
  }, [gl.domElement]);

  // A ref to smooth the computed distance.
  const smoothDistanceRef = useRef<number>(
    camera.position.distanceTo(
      controlsRef.current?.target || new THREE.Vector3(),
    ),
  );

  useFrame((delta) => {
    if (isBodyActive && activeBody) {
      // Compute the target position from the active body's scaled position.
      const target = new THREE.Vector3(
        activeBody.position.x / SimConstants.SCALE_FACTOR,
        activeBody.position.y / SimConstants.SCALE_FACTOR,
        activeBody.position.z / SimConstants.SCALE_FACTOR,
      );
      // Smoothly interpolate OrbitControls' target toward the active body's position.
      controlsRef.current.target.lerp(target, 0.05);

      // Use the tracking zoom value (which can be modified by the user's scroll).
      const computedDistance = trackingZoomRef.current;

      // Smooth the zoom level to avoid abrupt changes.
      smoothDistanceRef.current = THREE.MathUtils.lerp(
        smoothDistanceRef.current,
        computedDistance,
        0.05,
      );

      // Determine the direction from the target to the camera.
      const direction = camera.position
        .clone()
        .sub(controlsRef.current.target)
        .normalize();
      // Compute the desired camera position: target plus the direction scaled by the smoothed distance.
      const desiredPosition = controlsRef.current.target
        .clone()
        .add(direction.multiplyScalar(smoothDistanceRef.current));
      // Smoothly update the camera position.
      camera.position.lerp(desiredPosition, 0.05);
    }
    controlsRef.current.update();
  });

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping={true}
      dampingFactor={0.1}
      maxPolarAngle={Math.PI / 2}
    />
  );
};

export default CameraControls;
