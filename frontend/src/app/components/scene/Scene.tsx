import {Canvas, extend} from "@react-three/fiber";
import CameraControls from "@/app/components/utils/CameraControls";
import Sphere from "@/app/components/scene/Sphere";
import React, {useEffect, useState} from "react";
import {OrbitControls} from "three-stdlib";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/store/Store";
import SimConstants from "@/app/constants/SimConstants";
import {selectTimeStepKeys, setCurrentTimeStepIndex} from "@/app/store/slices/SimulationSlice";

extend({ OrbitControls });


//TODO use const
export default function Scene() {
    const dispatch = useDispatch();
    const simulationData = useSelector((state: RootState) => state.simulation.simulationData);
    const {isPaused, speedMultiplier, currentTimeStepIndex} = useSelector((state: RootState) => state.simulation.timeState);
    const timeStepKeys = useSelector(selectTimeStepKeys)
    const totalTimeSteps = timeStepKeys.length;

    // Animation loop
    // useEffect(() => {
    //     if (!simulationData || totalTimeSteps === 0) return;
    //
    //     const interval = setInterval(() => {
    //         setCurrentTimeStepIndex((prevIndex) => {
    //             if (prevIndex + 1 < totalTimeSteps) {
    //                 console.log(`Updating to index: ${prevIndex + 1}`); // Debug
    //                 return prevIndex + 1;
    //             } else {
    //                 console.log("Reached the end of timesteps, stopping animation."); // Debug
    //                 clearInterval(interval); // This needs to be handled correctly
    //                 return prevIndex; // Keep it at the last index
    //             }
    //         });
    //     }, 1000 / 30); // Adjust speed (e.g., 30 FPS)
    //
    //     // Cleanup the interval when the component unmounts or dependencies change
    //     return () => clearInterval(interval);
    // }, [simulationData, totalTimeSteps]);

    //with looping
    useEffect(() => {
        let lastTime = performance.now();
        let animationFrameId: number | null = null;

        const update = (time: number) => {
            const deltaTime = time - lastTime;

            if (!isPaused && simulationData && totalTimeSteps > 0) {
                const stepsToMove = Math.abs(speedMultiplier);
                const direction = speedMultiplier > 0 ? 1 : -1;

                // Update based on virtual FPS
                const timeStepInterval = 1000 / SimConstants.FPS;
                if (deltaTime >= timeStepInterval) {
                    const nextIndex = (currentTimeStepIndex + direction * stepsToMove + totalTimeSteps) % totalTimeSteps;
                    dispatch(setCurrentTimeStepIndex(nextIndex)); // Update Redux state
                    console.log(`Updating to index: ${nextIndex}`); // Debug
                    lastTime = time;
                }
            }
            // Keep the loop running
            animationFrameId = requestAnimationFrame(update);
        };

        // Start the animation loop
        animationFrameId = requestAnimationFrame(update);

        return () => {
            // Cleanup logic
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [simulationData, totalTimeSteps, isPaused, speedMultiplier, currentTimeStepIndex, dispatch]);

    if (!simulationData || !simulationData.data) {
        console.log("Simulation data is not loaded yet or is invalid.");
        return (
            <Canvas style={{ width: "100vw", height: "100vh" }}>
                <CameraControls />
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                <axesHelper args={[10000]} />
                <gridHelper args={[10000, 1000]} />
            </Canvas>
        ); // Render a loading state
    }

    // Current celestial bodies
    const currentTimeStep = timeStepKeys[currentTimeStepIndex];
    const celestialBodies =
        currentTimeStep && simulationData.data[currentTimeStep] ? simulationData.data[currentTimeStep] : [];

    return (
        <Canvas style={{width: "100%", height: "100%"}}
        >

            <CameraControls/>
            <ambientLight intensity={Math.PI / 2}/>
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
            <axesHelper args={[10000]}/>
            <gridHelper args={[10000, 1000]}/>

            {/* Render celestial bodies dynamically */}
            {celestialBodies.map((body, index) => {
                if (!body.position || body.position.x === undefined || body.position.y === undefined || body.position.z === undefined) {
                    console.warn(`Invalid position for celestial body: ${body.name}`);
                    return null;
                }

                return (
                    <Sphere
                        key={body.name}
                        name={body.name}
                        position={[body.position.x / SimConstants.SCALE_FACTOR,
                            body.position.y / SimConstants.SCALE_FACTOR,
                            body.position.z / SimConstants.SCALE_FACTOR,]}
                        // args={[body.radius / (SimConstants.RADIUS_SCALE_FACTOR), 32, 16]} // params: radius,
                        // widthSegments,
                        // heightSegments
                    />
                );
            })}
        </Canvas>
    );
}

