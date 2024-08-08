// pages/index.tsx

// redux only supports CSR
'use client'

import React, {useEffect, useRef, useState} from 'react'
import {Canvas, extend} from '@react-three/fiber'
import {OrbitControls} from 'three-stdlib';
import CameraControls from "@/app/components/CameraControls";
import Sphere from "@/app/components/Sphere";
import {AppDispatch, store} from "@/app/store/Store";
import {Provider, useDispatch} from "react-redux";
import Scene from "@/app/components/Scene";
import {fetchCelestialBodies} from "@/app/utils/fetchCelestialBodies";
import CelestialDataTest from "@/app/components/CelestialDataTest";
import CelestialDataFetcher from "@/app/components/CelestialDataTest";


export default function App() {
    return (
        <>
            <Provider store={store}>
                <CelestialDataTest/>
                <Scene/>
            </Provider>
        </>
    );
}