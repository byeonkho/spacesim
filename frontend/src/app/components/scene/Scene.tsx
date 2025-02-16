"use client";

import { Canvas, extend } from "@react-three/fiber";
import Camera from "@/app/components/scene/Camera";
import Sphere from "@/app/components/scene/Sphere";
import React, { useEffect, useState } from "react";
import { OrbitControls } from "three-stdlib";
import { useDispatch, useSelector } from "react-redux";
import SimConstants, { bodyProperties } from "@/app/constants/SimConstants";
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
  setIsBodyActive,
  CelestialBody,
  Vector3Simple,
  selectShowGrid,
  selectCelestialBodyPropertiesList,
} from "@/app/store/slices/SimulationSlice";
import { useTheme } from "@mui/material/styles";
import PlanetInfoOverlay from "@/app/components/scene/PlanetInfoOverlay";

import { scaleDistance } from "@/app/utils/helpers";

extend({ OrbitControls });

const Scene = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const celestialBodyPropertiesList = useSelector(
    selectCelestialBodyPropertiesList,
  );
  const [celestialBodyRadiusMap, setCelestialBodyRadiusMap] = useState(
    new Map<string, number>(),
  );
  const simulationSnapshot: CelestialBody[] = useSelector(
    selectCurrentSimulationSnapshot,
  );
  const showGrid: boolean = useSelector(selectShowGrid);
  const isPaused: boolean = useSelector(selectIsPaused);
  const isBodyActive: boolean = useSelector(selectIsBodyActive);
  const speedMultiplier: number = useSelector(selectSpeedMultiplier);
  const currentTimeStepIndex: number = useSelector(selectCurrentTimeStepIndex);
  const timeStepKeys = useSelector(selectTimeStepKeys);
  const totalTimeSteps: number = timeStepKeys.length;

  // get radii of bodies; this is in a separate one-time useEffect because we only send the radius data in the initial
  // REST response
  useEffect(() => {
    if (
      !celestialBodyPropertiesList ||
      celestialBodyPropertiesList.length === 0
    )
      return;

    const celestialBodyRadiusMap = new Map<string, number>();

    for (const celestialBodyProperties of celestialBodyPropertiesList) {
      if (
        celestialBodyProperties.name &&
        celestialBodyProperties.radius !== undefined
      ) {
        celestialBodyRadiusMap.set(
          celestialBodyProperties.name,
          celestialBodyProperties.radius / SimConstants.RADIUS_SCALE_FACTOR,
        );
      }
    }

    setCelestialBodyRadiusMap(celestialBodyRadiusMap);
  }, [celestialBodyPropertiesList]);

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
      onPointerMissed={(e: MouseEvent) => {
        dispatch(setIsBodyActive(false));
      }}
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
      <Camera />
      <ambientLight intensity={Math.PI / 2} />
      <axesHelper args={[10000]} />
      {showGrid && <gridHelper args={[10000, 1000]} />}

      {simulationSnapshot.map((body: CelestialBody) => {
        const radius: number = celestialBodyRadiusMap.get(body.name) ?? 1; // Default to 1 if not found
        let orbitingBody: CelestialBody | undefined;

        if (body.name.toUpperCase() === "SUN") {
          return (
            <React.Fragment key={body.name}>
              <pointLight
                key="sun-light"
                position={[body.position.x, body.position.y, body.position.z]}
                intensity={SimConstants.SCALE_FACTOR * 0.0001} // adjust the intensity as needed
                distance={SimConstants.SCALE_FACTOR} // adjust the distance so the light falls off
                // appropriately
                color={0xffffff} // typically white light for the sun
              />
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
                textureUrl={
                  bodyProperties[body.name.toUpperCase()]?.texture.src ||
                  bodyProperties["FALLBACK"].texture.src
                }
              />
            </React.Fragment>
          );
        }

        // prepare orbitingBody if current body needs to be distance scaled
        if (bodyProperties[body.name.toUpperCase()].positionScale !== 1) {
          const orbitingBodyName: string =
            bodyProperties[body.name.toUpperCase()].orbitingBody;
          if (orbitingBodyName) {
            orbitingBody = simulationSnapshot.find(
              (b) => b.name.toUpperCase() === orbitingBodyName.toUpperCase(),
            );
          }
        }

        return (
          <Sphere
            key={body.name}
            name={body.name}
            body={body}
            position={
              orbitingBody
                ? (() => {
                    const scaled: Vector3Simple = scaleDistance(
                      body.position,
                      orbitingBody.position,
                      bodyProperties[body.name.toUpperCase()].positionScale,
                    );
                    return [
                      scaled.x / SimConstants.SCALE_FACTOR,
                      scaled.y / SimConstants.SCALE_FACTOR,
                      scaled.z / SimConstants.SCALE_FACTOR,
                    ] as [number, number, number];
                  })()
                : [
                    body.position.x / SimConstants.SCALE_FACTOR,
                    body.position.y / SimConstants.SCALE_FACTOR,
                    body.position.z / SimConstants.SCALE_FACTOR,
                  ]
            }
            radius={radius} // Pass radius to Sphere component
            textureUrl={
              bodyProperties[body.name.toUpperCase()]?.texture.src ||
              bodyProperties["FALLBACK"].texture.src
            }
          />
        );
      })}
      <PlanetInfoOverlay />
    </Canvas>
  );
};

export default Scene;
