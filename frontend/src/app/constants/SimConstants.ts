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
      GRID: {
        SIZE: 3650,
        SEGMENTS: 100,
      },
      AXES: {
        SIZE: 2000,
      },
    },
    REALISTIC: {
      name: "Realistic",
      positionScale: 100_000_000, // larger values scale the system down
      radiusScale: 100_000_000, // larger values scale radius down,
      EXCEPTION_BODIES_POSITION_SCALE: {
        MOON: 1,
      },
      GRID: {
        SIZE: 148250,
        SEGMENTS: 100,
      },
      AXES: {
        SIZE: 80000,
      },
    },
  },
  // SCALE_FACTOR: MathConstants.METRES_TO_AU / 250, // larger divisors scale position up
  FPS: 60,
  MAX_TIMESTEPS: 30_000,
  TIMESTEP_CHUNK_SIZE: 10_000,
  MAX_SPEED_MULTIPLIER: 128, // exponent of 2
};

export interface BodyProperties {
  texture: StaticImageData;
}

export const bodyProperties: Record<string, BodyProperties> = {
  MERCURY: {
    texture: MercuryTexture as StaticImageData,
  },
  VENUS: {
    texture: VenusTexture as StaticImageData,
  },
  EARTH: {
    texture: EarthTexture as StaticImageData,
  },
  MARS: {
    texture: MarsTexture as StaticImageData,
  },
  JUPITER: {
    texture: JupiterTexture as StaticImageData,
  },
  SATURN: {
    texture: SaturnTexture as StaticImageData,
  },
  URANUS: {
    texture: UranusTexture as StaticImageData,
  },
  NEPTUNE: {
    texture: NeptuneTexture as StaticImageData,
  },
  MOON: {
    texture: MoonTexture as StaticImageData,
  },
  SUN: {
    texture: SunTexture as StaticImageData,
  },
  FALLBACK: {
    texture: FallbackTexture as StaticImageData,
  },
};

export default SimConstants;
