import { MeshProps } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/Store";
import { setActiveBodyName } from "@/app/store/slices/SimulationSlice";

interface CelestialBodyProps extends MeshProps {
  name: string;
  color?: THREE.ColorRepresentation;
  radius?: number;
}

const Sphere: React.FC<CelestialBodyProps> = ({
  radius,
  position,
  name,
  color = "orange",
  ...props
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <mesh
      {...props}
      position={position}
      ref={meshRef}
      // scale={activeCelestialBodyName === name ? 1.5 : 1}
      onClick={() => dispatch(setActiveBodyName(name))}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? "hotpink" : color}
        wireframe={true}
      />
    </mesh>
  );
};

export default Sphere;
