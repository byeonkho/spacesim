import MathConstants from "@/app/constants/MathConstants";
import { StaticImageData } from "next/image";
import MercuryTexture from "@/assets/textures/mercury_texture.jpg";
import VenusTexture from "@/assets/textures/venus_texture.jpg";
import EarthTexture from "@/assets/textures/earth_texture.jpg";
import MarsTexture from "@/assets/textures/mars_texture.jpg";
import JupiterTexture from "@/assets/textures/jupiter_texture.jpg";
import SaturnTexture from "@/assets/textures/saturn_texture.jpg";
import UranusTexture from "@/assets/textures/uranus_texture.jpg";
import NeptuneTexture from "@/assets/textures/neptune_texture.jpg";
import MoonTexture from "@/assets/textures/moon_texture.jpg";
import SunTexture from "@/assets/textures/sun_texture.jpg";
import FallbackTexture from "@/assets/textures/earth_texture.jpg";

const SimConstants = {
  // SCALE_FACTOR: MathConstants.METRES_TO_AU / 250, // larger divisors scale position up
  SCALE_FACTOR: 40_00_000_000, // larger values scale the system down
  RADIUS_SCALE_FACTOR: 100_000_000, // larger values scale radius down

  //////// these are good values
  // SCALE_FACTOR: 1_00_000_000, // larger values scale the system down
  // RADIUS_SCALE_FACTOR: 18_000_000, // larger values scale radius down

  /////// upper end - more realistic
  // SCALE_FACTOR: 8_00_000_000, // larger values scale the system down
  // RADIUS_SCALE_FACTOR: 100_000_000, // larger values scale radius down

  FPS: 60,
  MAX_TIMESTEPS: 30_000,
  TIMESTEP_CHUNK_SIZE: 10_000,
  MAX_SPEED_MULTIPLIER: 128, // exponent of 2
};

interface BodyProperties {
  positionScale?: number;
  isBright?: boolean;
  hasAtmosphere?: boolean;
  texture: StaticImageData;
  orbitingBody?: string; // mandatory for bodies that needs to be position scaled
}

export const bodyProperties: Record<string, BodyProperties> = {
  MERCURY: {
    positionScale: 1,
    hasAtmosphere: false,
    texture: MercuryTexture as StaticImageData,
  },
  VENUS: {
    positionScale: 1,
    hasAtmosphere: true,
    isBright: false,
    texture: VenusTexture as StaticImageData,
  },
  EARTH: {
    positionScale: 1,
    hasAtmosphere: true,
    isBright: false,
    texture: EarthTexture as StaticImageData,
  },
  MARS: {
    positionScale: 1,
    hasAtmosphere: true,
    isBright: false,
    texture: MarsTexture as StaticImageData,
  },
  JUPITER: {
    positionScale: 1,
    hasAtmosphere: true,
    isBright: false,
    texture: JupiterTexture as StaticImageData,
  },
  SATURN: {
    positionScale: 1,
    hasAtmosphere: true,
    isBright: false,
    texture: SaturnTexture as StaticImageData,
  },
  URANUS: {
    positionScale: 1,
    hasAtmosphere: true,
    isBright: false,
    texture: UranusTexture as StaticImageData,
  },
  NEPTUNE: {
    positionScale: 1,
    hasAtmosphere: true,
    isBright: false,
    texture: NeptuneTexture as StaticImageData,
  },
  MOON: {
    positionScale: 10,
    hasAtmosphere: false,
    isBright: true,
    orbitingBody: "EARTH",
    texture: MoonTexture as StaticImageData,
  },
  SUN: {
    positionScale: 1,
    hasAtmosphere: false,
    isBright: true,
    texture: SunTexture as StaticImageData,
  },
  FALLBACK: {
    texture: FallbackTexture as StaticImageData,
  },
};

export default SimConstants;
