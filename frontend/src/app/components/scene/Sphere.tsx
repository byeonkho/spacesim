import {MeshProps, useFrame} from "@react-three/fiber";
import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from "@/app/store/Store";
import {setActiveCelestialBodyName} from "@/app/store/simulationSlice";
import {GUI} from "dat.gui";

interface CelestialBodyProps extends MeshProps {
    name: string;
    color?: THREE.ColorRepresentation;
}

const Sphere: React.FC<CelestialBodyProps> = ({
                                                  args = [5, 16, 32],
                                                  name,
                                                  color = 'orange',// Default args value
                                                  ...props
                                              }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const activeCelestialBodyName = useSelector((state: RootState) => state.simulation.activeCelestialBodyName);

    useEffect(() => {
        if (typeof window !== 'undefined' && meshRef.current) {
            import('dat.gui').then(({GUI}) => { // executes only if the window object exists. dat.gui needs it and
                // it's only available on the browser. next.js renders SSR and skips this, react then executes it CSR.
                const gui = new GUI();

                // Position Controls
                // const positionFolder = gui.addFolder(`Position Controls - ${name}`);
                // positionFolder.add(meshRef.current.position, 'x', -50, 50);
                // positionFolder.add(meshRef.current.position, 'y', -50, 50);
                // positionFolder.add(meshRef.current.position, 'z', -50, 50);
                // positionFolder.open();
                //
                // // Rotation Controls
                // const rotationFolder = gui.addFolder(`Rotation Controls - ${name}`);
                // rotationFolder.add(meshRef.current.rotation, 'x', 0, Math.PI * 2);
                // rotationFolder.add(meshRef.current.rotation, 'y', 0, Math.PI * 2);
                // rotationFolder.add(meshRef.current.rotation, 'z', 0, Math.PI * 2);
                // rotationFolder.open();

                return () => {
                    gui.destroy();
                };
            });
        }
    }, [name]);

    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={activeCelestialBodyName === name ? 1.5 : 1}
            onClick={() => dispatch(setActiveCelestialBodyName(activeCelestialBodyName === name ? null : name))}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <sphereGeometry args={args}/>
            <meshStandardMaterial color={hovered ? 'hotpink' : color} wireframe={true}/>
        </mesh>
    );
}

export default Sphere;