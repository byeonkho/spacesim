// pages/index.tsx

// redux only supports CSR
'use client'

import React, {useEffect, useRef, useState} from 'react'
import {Canvas, extend} from '@react-three/fiber'
import {OrbitControls} from 'three-stdlib';
import CameraControls from "@/app/components/utils/CameraControls";
import Sphere from "@/app/components/scene/Sphere";
import {AppDispatch, store} from "@/app/store/Store";
import {Provider, useDispatch} from "react-redux";
import Scene from "@/app/components/scene/Scene";
import CelestialDataTest from "@/app/components/CelestialDataTest";
import CelestialDataFetcher from "@/app/components/CelestialDataTest";
import Interface from "@/app/components/interface/Interface";
import Layout from "@/app/components/interface/Layout";
import {ThemeProvider} from "@mui/system";
import theme from "@/muiTheme";


export default function App() {
    return (
        <>

            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Layout/>
                    <Scene/>
                </ThemeProvider>
            </Provider>
        </>
    );
}