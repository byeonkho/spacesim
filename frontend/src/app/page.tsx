// pages/index.tsx

// allows for CSR instead of SSR by default
"use client"

import Box from "@/app/components/Box";
import React, {useRef, useState} from 'react'
import {Canvas, extend} from '@react-three/fiber'
import {OrbitControls} from 'three-stdlib';
import CameraControls from "@/app/components/CameraControls";
import Sphere from "@/app/components/Sphere";
import {store} from "@/app/store/Store";
import {Provider} from "react-redux";

extend({OrbitControls});

export default function App() {
    return (
        <Provider store={store}>
            <Canvas
                // sets the default view on initial render
                style={{width: '100vw', height: '100vh'}}
            >
                <CameraControls/>
                <ambientLight intensity={Math.PI / 2}/>
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
                <Sphere id={"2"} position={[10, 0, 0]} />
                <axesHelper args={[10000]}/>
                {/* args = length*/}
                <gridHelper args={[10000, 1000]}/>
                {/* args = length, divisions*/}
            </Canvas>
        </Provider>
    );
}