import MathConstants from "@/app/constants/MathConstants";
import { StaticImageData } from "next/image";
import MercuryTexture from "../../../public/textures/mercury_texture.jpg";
import VenusTexture from "../../../public/textures/venus_texture.jpg";
import EarthTexture from "../../../public/textures/earth_texture.jpg";
import MarsTexture from "../../../public/textures/mars_texture.jpg";
import JupiterTexture from "../../../public/textures/jupiter_texture.jpg";
import SaturnTexture from "../../../public/textures/saturn_texture.jpg";
import UranusTexture from "../../../public/textures/uranus_texture.jpg";
import NeptuneTexture from "../../../public/textures/neptune_texture.jpg";
import MoonTexture from "../../../public/textures/moon_texture.jpg";
import SunTexture from "../../../public/textures/sun_texture.jpg";
import FallbackTexture from "../../../public/textures/earth_texture.jpg";

const SimConstants = {
  SCALE: {
    SEMI_REALISTIC: {
      name: "Semi-Realistic",
      positionScale: 4_000_000_000, // larger values scale the system down
      radiusScale: 100_000_000, // larger values scale radius down
      EXCEPTION_BODIES_POSITION_SCALE: {
        MOON: 15,
      },
    },
    REALISTIC: {
      name: "Realistic",
      positionScale: 100_000_000, // larger values scale the system down
      radiusScale: 100_000_000, // larger values scale radius down,
      EXCEPTION_BODIES_POSITION_SCALE: {
        MOON: 1,
      },
    },
  },
  // SCALE_FACTOR: MathConstants.METRES_TO_AU / 250, // larger divisors scale position up

  //////// these are good values
  // SCALE_FACTOR: 1_00_000_000, // larger values scale the system down
  // RADIUS_SCALE_FACTOR: 18_000_000, // larger values scale radius down

  /////// upper end - more realistic
  // SCALE_FACTOR: 40_00_000_000, // larger values scale the system down
  // RADIUS_SCALE_FACTOR: 100_000_000, // larger values scale radius down

  FPS: 60,
  MAX_TIMESTEPS: 30_000,
  TIMESTEP_CHUNK_SIZE: 10_000,
  MAX_SPEED_MULTIPLIER: 128, // exponent of 2
};

export interface BodyProperties {
  positionScale?: number;
  texture: StaticImageData;
}

export const bodyProperties: Record<string, BodyProperties> = {
  MERCURY: {
    positionScale: 1,
    texture: MercuryTexture as StaticImageData,
  },
  VENUS: {
    positionScale: 1,
    texture: VenusTexture as StaticImageData,
  },
  EARTH: {
    positionScale: 1,
    texture: EarthTexture as StaticImageData,
  },
  MARS: {
    positionScale: 1,
    texture: MarsTexture as StaticImageData,
  },
  JUPITER: {
    positionScale: 1,
    texture: JupiterTexture as StaticImageData,
  },
  SATURN: {
    positionScale: 1,
    texture: SaturnTexture as StaticImageData,
  },
  URANUS: {
    positionScale: 1,
    texture: UranusTexture as StaticImageData,
  },
  NEPTUNE: {
    positionScale: 1,
    texture: NeptuneTexture as StaticImageData,
  },
  MOON: {
    positionScale: 15,
    texture: MoonTexture as StaticImageData,
  },
  SUN: {
    positionScale: 1,
    texture: SunTexture as StaticImageData,
  },
  FALLBACK: {
    texture: FallbackTexture as StaticImageData,
  },
};

export default SimConstants;
