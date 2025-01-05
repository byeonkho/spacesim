import {Canvas, extend} from "@react-three/fiber";
import CameraControls from "@/app/components/utils/CameraControls";
import Sphere from "@/app/components/scene/Sphere";
import React, {useEffect, useState} from "react";
import {OrbitControls} from "three-stdlib";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/store/Store";
import SimConstants from "@/app/constants/SimConstants";
import {selectTimeStepKeys, setCurrentTimeStepIndex, setCurrentTimeStepKey} from "@/app/store/slices/SimulationSlice";

extend({ OrbitControls });

const Scene = () => {
    const dispatch = useDispatch();
    const simulationData = useSelector((state: RootState) => state.simulation.simulationData);
    const { isPaused, speedMultiplier, currentTimeStepIndex, isUpdating } = useSelector((state: RootState) => state.simulation.timeState);
    const timeStepKeys = useSelector(selectTimeStepKeys);
    const totalTimeSteps = timeStepKeys.length;

    const [celestialBodies, setCelestialBodies] = useState([]);

    useEffect(() => {
        let lastTime = performance.now();
        let animationFrameId: number | null = null;

        const update = (time: number) => {
            const deltaTime = time - lastTime;

            if (!isPaused && !isUpdating && simulationData && totalTimeSteps > 0) {
                const stepsToMove = Math.abs(speedMultiplier);
                const direction = speedMultiplier > 0 ? 1 : -1;

                // Update based on virtual FPS
                const timeStepInterval = 1000 / SimConstants.FPS;
                if (deltaTime >= timeStepInterval) {
                    const nextIndex = (currentTimeStepIndex + direction * stepsToMove + totalTimeSteps) % totalTimeSteps;
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
    }, [simulationData, totalTimeSteps, isPaused, isUpdating, speedMultiplier, currentTimeStepIndex, dispatch]);

    // derive bodies at current timestep
    useEffect(() => {
        if (timeStepKeys.length > 0 && currentTimeStepIndex < timeStepKeys.length) {
            const currentTimeStep = timeStepKeys[currentTimeStepIndex];
            const bodies = currentTimeStep && simulationData[currentTimeStep] ? simulationData[currentTimeStep] : [];

            dispatch(setCurrentTimeStepKey(currentTimeStep)); // Update global state
            setCelestialBodies(bodies); // Update local state
        }
    }, [currentTimeStepIndex, timeStepKeys, simulationData, dispatch]);

    if (!simulationData) {
        return (
            <Canvas style={{ width: "100vw", height: "100vh" }}>
                <CameraControls />
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
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
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <axesHelper args={[10000]} />
            <gridHelper args={[10000, 1000]} />

            {celestialBodies.map((body) => (
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
