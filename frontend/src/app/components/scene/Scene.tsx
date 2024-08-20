import {Canvas, extend} from "@react-three/fiber";
import CameraControls from "@/app/components/utils/CameraControls";
import Sphere from "@/app/components/scene/Sphere";
import React from "react";
import {OrbitControls} from "three-stdlib";
import CelestialBody from "@/app/components/scene/Sphere";

extend({OrbitControls});

export default function Scene() {
    return (
            <Canvas
                // sets the default view on initial render
                style={{width: '100vw', height: '100vh'}}
            >
                <CameraControls/>
                <ambientLight intensity={Math.PI / 2}/>
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
                <Sphere name={"2"} position={[10, 0, 0]} />
                <Sphere name={"1"} position={[50, 0, 0]} />
                <axesHelper args={[10000]}/>
                {/* args = length*/}
                <gridHelper args={[10000, 1000]}/>
                {/* args = length, divisions*/}
            </Canvas>
    );
}