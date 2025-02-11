"use client";

import { Canvas, extend } from "@react-three/fiber";
import CameraControls from "@/app/components/utils/CameraControls";
import Sphere from "@/app/components/scene/Sphere";
import React, { useEffect, useState } from "react";
import { OrbitControls } from "three-stdlib";
import { useDispatch, useSelector } from "react-redux";
import SimConstants from "@/app/constants/SimConstants";
import * as THREE from "three";
import {
  deleteExcessData,
  selectCelestialBodyList,
  selectCurrentTimeStepIndex,
  selectIsPaused,
  selectCurrentSimulationSnapshot,
  selectSpeedMultiplier,
  selectTimeStepKeys,
  setCurrentTimeStepIndex,
  selectIsBodyActive,
  updateActiveBody,
} from "@/app/store/slices/SimulationSlice";
import { useTheme } from "@mui/material/styles";
import PlanetInfoOverlay from "@/app/components/scene/PlanetInfoOverlay";

extend({ OrbitControls });

const Scene = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const celestialBodyList = useSelector(selectCelestialBodyList);
  const [celestialBodyRadiusMap, setCelestialBodyRadiusMap] = useState(
    new Map<string, number>(),
  );
  const simulationSnapshot = useSelector(selectCurrentSimulationSnapshot);
  const isPaused = useSelector(selectIsPaused);
  const isBodyActive = useSelector(selectIsBodyActive);
  const speedMultiplier = useSelector(selectSpeedMultiplier);
  const currentTimeStepIndex = useSelector(selectCurrentTimeStepIndex);
  const timeStepKeys = useSelector(selectTimeStepKeys);
  const totalTimeSteps = timeStepKeys.length;

  // get radii of bodies; this is in a separate one-time useEffect because we only send the radius data in the initial
  // REST response
  useEffect(() => {
    if (!celestialBodyList || celestialBodyList.length === 0) return;

    const celestialBodyRadiusMap = new Map<string, number>();

    for (const celestialBody of celestialBodyList) {
      if (celestialBody.name && celestialBody.radius !== undefined) {
        celestialBodyRadiusMap.set(
          celestialBody.name,
          celestialBody.radius / SimConstants.RADIUS_SCALE_FACTOR,
        );
      }
    }

    setCelestialBodyRadiusMap(celestialBodyRadiusMap);
  }, [celestialBodyList]);

  // main rendering loop
  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId: number | null = null;

    const update = (time: number) => {
      checkDeleteExcessData();

      if (isBodyActive) {
        dispatch(updateActiveBody());
      }

      const deltaTime = time - lastTime;

      if (!isPaused && simulationSnapshot && totalTimeSteps > 0) {
        // update active body for UI rendering

        const stepsToMove = Math.abs(speedMultiplier);
        const direction = speedMultiplier > 0 ? 1 : -1;

        // update based on virtual FPS
        const timeStepInterval = 1000 / SimConstants.FPS;
        if (deltaTime >= timeStepInterval) {
          const nextIndex = Math.max(
            0,
            currentTimeStepIndex + direction * stepsToMove,
          );
          dispatch(setCurrentTimeStepIndex(nextIndex)); // Update Redux state
          lastTime = time;
        }
      }
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    simulationSnapshot,
    isPaused,
    speedMultiplier,
    currentTimeStepIndex,
    dispatch,
  ]);

  const checkDeleteExcessData = () => {
    if (timeStepKeys.length > SimConstants.MAX_TIMESTEPS) {
      const excessCount = SimConstants.TIMESTEP_CHUNK_SIZE;
      const payload = {
        excessCount: excessCount,
        timeStepKeys: timeStepKeys,
      };
      dispatch(deleteExcessData(payload));
    }
  };

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      onCreated={({ scene }) => {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const context = canvas.getContext("2d");

        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, theme.canvas.canvasMain);
        gradient.addColorStop(0.5, theme.canvas.canvasGradientEdge);
        gradient.addColorStop(1, theme.canvas.canvasGradientEdge);

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const numStars = 500;
        for (let i = 0; i < numStars; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const minRadius = 0.05;
          const maxRadius = 0.1;
          const radius = minRadius + Math.random() * (maxRadius - minRadius);
          const opacity = 0.5 + Math.random() * 0.5;
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          context.fill();
        }

        scene.background = new THREE.CanvasTexture(canvas);
      }}
    >
      <CameraControls />
      <ambientLight intensity={Math.PI / 2} />
      <axesHelper args={[10000]} />
      <gridHelper args={[10000, 1000]} />

      {simulationSnapshot.map((body) => {
        const radius = celestialBodyRadiusMap.get(body.name) ?? 1; // Default to 1 if not found

        // console.log("radius: " + radius);

        return (
          <Sphere
            key={body.name}
            name={body.name}
            body={body}
            position={[
              body.position.x / SimConstants.SCALE_FACTOR,
              body.position.y / SimConstants.SCALE_FACTOR,
              body.position.z / SimConstants.SCALE_FACTOR,
            ]}
            radius={radius} // Pass radius to Sphere component
          />
        );
      })}
      <PlanetInfoOverlay />
    </Canvas>
  );
};

export default Scene;
