import { Canvas, extend } from "@react-three/fiber";
import CameraControls from "@/app/components/utils/CameraControls";
import Sphere from "@/app/components/scene/Sphere";
import React, {useEffect, useState} from "react";
import { OrbitControls } from "three-stdlib";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/Store";
import SimConstants from "@/app/constants/SimConstants";

extend({ OrbitControls });

export default function Scene() {
    const simulationData = useSelector((state: RootState) => state.simulation.simulationData);
    const {isPaused, progress, speedMultiplier} = useSelector((state: RootState) => state.simulation.timeControls);


    // Debug Redux state
    console.log("Simulation data from Redux:", simulationData);

    // Track the current time step
    const [currentTimeStepIndex, setCurrentTimeStepIndex] = useState(0);
    const timeStepKeys = simulationData
        ? Object.keys(simulationData.data).sort((a, b) => {
            const dateA = new Date(a.split(": ")[1]).getTime();
            const dateB = new Date(b.split(": ")[1]).getTime();
            return dateA - dateB; // Sort ascending by timestamp
        })
        : [];
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
        if (!simulationData || totalTimeSteps === 0 || isPaused) {
            console.log("Animation loop paused.");
            return; // Skip setting the interval if paused or no data
        }

        const interval = setInterval(() => {
            setCurrentTimeStepIndex((prevIndex) => {
                // Adjust the index based on the speed multiplier
                const stepsToMove = Math.abs(speedMultiplier); // Number of steps to move
                const direction = speedMultiplier > 0 ? 1 : -1; // Determine direction (forward or backward)
                const nextIndex = (prevIndex + direction * stepsToMove + totalTimeSteps) % totalTimeSteps;
                console.log(`Updating to index: ${nextIndex}`); // Debug
                return nextIndex;
            });
        }, 1000 / SimConstants.FPS); // Fixed interval based on FPS

        // Cleanup the interval when the component unmounts or dependencies change
        return () => {
            console.log("Cleaning up interval.");
            clearInterval(interval);
        };
    }, [simulationData, totalTimeSteps, isPaused, speedMultiplier]);


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
    console.log("current timestep: ", currentTimeStep);
    const celestialBodies =
        currentTimeStep && simulationData.data[currentTimeStep] ? simulationData.data[currentTimeStep] : [];
    // Debug celestial bodies
    console.log("Celestial bodies at latest timeStep:", celestialBodies);

    return (
        <Canvas style={{ width: "100%", height: "100%" }}>
            <CameraControls />
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <axesHelper args={[10000]} />
            <gridHelper args={[10000, 1000]} />

            {/* Render celestial bodies dynamically */}
            {celestialBodies.map((body, index) => {
                console.log(`Rendering celestial body at index ${index}:`, body);

                if (!body.position || body.position.x === undefined || body.position.y === undefined || body.position.z === undefined) {
                    console.warn(`Invalid position for celestial body: ${body.name}`);
                    return null;
                }

                return (
                    <Sphere
                        key={body.name}
                        name={body.name}
                        position={[ body.position.x / SimConstants.SCALE_FACTOR,
                                    body.position.y / SimConstants.SCALE_FACTOR,
                                    body.position.z / SimConstants.SCALE_FACTOR,]}
                        // args={[body.radius / (SimConstants.SCALE_FACTOR), 32, 16]} // params: radius, widthSegments,
                        // heightSegments
                    />
                );
            })}
        </Canvas>
    );
}

