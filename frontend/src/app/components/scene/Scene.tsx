import { Canvas, extend } from "@react-three/fiber";
import CameraControls from "@/app/components/utils/CameraControls";
import Sphere from "@/app/components/scene/Sphere";
import React, { useEffect } from "react";
import { OrbitControls } from "three-stdlib";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/Store";
import SimConstants from "@/app/constants/SimConstants";
import {
  deleteExcessData,
  selectCurrentTimeStepIndex,
  selectIsPaused,
  selectSimulationSnapshot,
  selectSpeedMultiplier,
  selectTimeStepKeys,
  setCurrentTimeStepIndex,
} from "@/app/store/slices/SimulationSlice";

extend({ OrbitControls });

const Scene = () => {
  const dispatch = useDispatch();
  const simulationSnapshot = useSelector(selectSimulationSnapshot);
  const isPaused = useSelector(selectIsPaused);
  const speedMultiplier = useSelector(selectSpeedMultiplier);
  const currentTimeStepIndex = useSelector(selectCurrentTimeStepIndex);
  const timeStepKeys = useSelector(selectTimeStepKeys);
  const totalTimeSteps = timeStepKeys.length;

  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId: number | null = null;

    const update = (time: number) => {
      checkDeleteExcessData();

      const deltaTime = time - lastTime;

      if (!isPaused && simulationSnapshot && totalTimeSteps > 0) {
        const stepsToMove = Math.abs(speedMultiplier);
        const direction = speedMultiplier > 0 ? 1 : -1;

        // Update based on virtual FPS
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

  if (!simulationSnapshot) {
    return (
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <CameraControls />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <axesHelper args={[10000]} />
        <gridHelper args={[10000, 1000]} />
      </Canvas>
    );
  }

  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      <CameraControls />
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <axesHelper args={[10000]} />
      <gridHelper args={[10000, 1000]} />

      {simulationSnapshot.map((body) => (
        <Sphere
          key={body.name}
          name={body.name}
          position={[
            body.position.x / SimConstants.SCALE_FACTOR,
            body.position.y / SimConstants.SCALE_FACTOR,
            body.position.z / SimConstants.SCALE_FACTOR,
          ]}
        />
      ))}
    </Canvas>
  );
};

export default Scene;
