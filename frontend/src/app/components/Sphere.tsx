import {MeshProps, ThreeElements, useFrame} from "@react-three/fiber";
import React, {useRef, useState} from "react";
import * as THREE from "three";

// Define an interface for the Sphere component's props
interface SphereProps extends MeshProps {
    color?: THREE.ColorRepresentation;
}

const Sphere: React.FC<SphereProps> = ({
                                            // defaults if not defined
                                           args = [5, 32, 16], // args is the default name used by fiber as geometry
                                           color = 'orange',

                                           ...props
                                       }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta;
            meshRef.current.rotation.y += delta;
        }
    });

    return (
        <mesh
            {...props} // Spread other props to the mesh element
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <sphereGeometry args={args}/>  {/* Use the args prop for geometry */}
            <meshStandardMaterial color={hovered ? 'hotpink' : color}/>
        </mesh>
    );
}

export default Sphere;