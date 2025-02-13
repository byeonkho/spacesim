import { MeshProps, useLoader } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/Store";
import {
  CelestialBody,
  setActiveBody,
} from "@/app/store/slices/SimulationSlice";
import * as THREE from "three";

interface CelestialBodyProps extends MeshProps {
  name: string;
  color?: THREE.ColorRepresentation;
  radius: number;
  body: CelestialBody;
  textureUrl?: string;
}

const Sphere: React.FC<CelestialBodyProps> = ({
  radius,
  position,
  name,
  color = "orange",
  body,
  textureUrl,
  ...props
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const dispatch = useDispatch<AppDispatch>();

  const texture = useLoader(
    THREE.TextureLoader as any,
    textureUrl || "/path/to/placeholder.png",
  );

  return (
    <mesh
      {...props}
      position={position}
      ref={meshRef}
      onClick={() => dispatch(setActiveBody(body))}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial map={textureUrl ? texture : undefined} />
    </mesh>
  );
};

export default Sphere;
