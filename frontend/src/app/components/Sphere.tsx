import { MeshProps, useFrame } from "@react-three/fiber";
import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/app/store/store";
import { setActiveCelestialBodyId } from "@/app/store/CelestialBodySlice";
import CelestialBodyGUI from './CelestialBodyGUI';
import {GUI} from "dat.gui";

interface SphereProps extends Omit<MeshProps, 'id'> {
    id: string;
    color?: THREE.ColorRepresentation;
    // args?: [number, number, number];
}

const Sphere: React.FC<SphereProps> = ({
                                           id,

                                           args = [5, 16, 32],
                                           color= 'orange',// Default args value
                                           ...props
                                       }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    // const celestialBody = useSelector((state: RootState) =>
    //     state.celestialBody.bodies.find(body => body.id === id)
    // );
    const activeCelestialBodyId = useSelector((state: RootState) => state.celestialBody.activeSphereId);

    useEffect(() => {
        if (meshRef.current) {
            const gui = new GUI();

            // Position Controls
            const positionFolder = gui.addFolder(`Position Controls - ${id}`);
            positionFolder.add(meshRef.current.position, 'x', -50, 50);
            positionFolder.add(meshRef.current.position, 'y', -50, 50);
            positionFolder.add(meshRef.current.position, 'z', -50, 50);
            positionFolder.open();

            // Rotation Controls
            const rotationFolder = gui.addFolder(`Rotation Controls - ${id}`);
            rotationFolder.add(meshRef.current.rotation, 'x', 0, Math.PI * 2);
            rotationFolder.add(meshRef.current.rotation, 'y', 0, Math.PI * 2);
            rotationFolder.add(meshRef.current.rotation, 'z', 0, Math.PI * 2);
            rotationFolder.open();

            return () => {
                gui.destroy();
            };
        }
    }, [id]);

    return (
        <>
            <mesh
                {...props}
                ref={meshRef}
                scale={activeCelestialBodyId === id ? 1.5 : 1}
                onClick={() => dispatch(setActiveCelestialBodyId(activeCelestialBodyId === id ? null : id))}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={args} />
                <meshStandardMaterial color={hovered ? 'hotpink' : color} wireframe = {true} />
            </mesh>
        </>
    );
}

export default Sphere;