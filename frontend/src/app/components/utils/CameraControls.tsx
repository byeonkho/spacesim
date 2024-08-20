import {useFrame, useThree} from "@react-three/fiber";
import React, {useRef} from "react";

function CameraControls() {
    const { camera, gl } = useThree();
    const controlsRef = useRef(null);

    useFrame(() => {
        if (controlsRef.current) {
            controlsRef.current.update();
        }
    });

    return <orbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
}

export default CameraControls;