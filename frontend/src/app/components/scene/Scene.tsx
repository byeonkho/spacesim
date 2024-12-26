import { Canvas, extend } from "@react-three/fiber";
import CameraControls from "@/app/components/utils/CameraControls";
import Sphere from "@/app/components/scene/Sphere";
import React from "react";
import { OrbitControls } from "three-stdlib";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/Store";
import SimConstants from "@/app/constants/SimConstants";

extend({ OrbitControls });

export default function Scene() {
    const simulationData = useSelector((state: RootState) => state.simulation.simulationData);

    // Debug Redux state
    console.log("Simulation data from Redux:", simulationData);

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

    // Extract the latest date key
    const latestTimestep = Object.keys(simulationData.data)
        .sort((a, b) => new Date(a.split(": ")[1]).getTime() - new Date(b.split(": ")[1]).getTime())
        .pop();

    console.log("Latest timestep:", latestTimestep);

    // Get celestial bodies or fallback to an empty array
    const celestialBodies = latestTimestep && Array.isArray(simulationData.data[latestTimestep])
        ? simulationData.data[latestTimestep]
        : [];

    // Debug celestial bodies
    console.log("Celestial bodies at latest timestep:", celestialBodies);

    return (
        <Canvas style={{ width: "100vw", height: "100vh" }}>
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
                        // args={[body.radius / (SimConstants.SCALE_FACTOR), 32, 16]} // params: args, widthSegments,
                        // heightSegments
                    />
                );
            })}
        </Canvas>
    );
}
