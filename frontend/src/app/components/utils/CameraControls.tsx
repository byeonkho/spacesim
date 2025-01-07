import React, {useRef} from "react";
import {extend, useFrame, useThree} from "@react-three/fiber";
import {OrbitControls} from "three-stdlib";

extend({ OrbitControls });

const CameraControls = () => {
    const { camera, gl } = useThree();
    const controlsRef = useRef(null);

    useFrame(() => {
        if (controlsRef.current) {
            controlsRef.current.update();
        }
    });

    return (
        <orbitControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            enableDamping={true}
            dampingFactor={0.1}
            minDistance={1e1} // Minimum zoom distance
            maxDistance={1e12} // Maximum zoom distance
            maxPolarAngle={Math.PI / 2} // Restrict vertical rotation
        />
    );
};

export default CameraControls;
