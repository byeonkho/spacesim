"use client";

import { useCallback } from "react";
import { useTexture } from "@react-three/drei";
import {
  EquirectangularReflectionMapping,
  SRGBColorSpace,
  Texture,
} from "three";

// Deep-space skybox — equirectangular star map mounted directly on
// scene.background. Replaces drei <Stars/>: that produced visible
// twinkle on camera rotation because its size-attenuation formula
// (gl_PointSize = size * 30 / -mvPosition.z) collapses to sub-pixel
// values at our scene scale (radius 100k wu), and the GPU clamps to
// 1 px minimum — so every star rasterized at exactly 1 px and
// flickered between adjacent pixels as the projected center crossed
// pixel boundaries during orbit.
//
// The texture: ESO's 6000×3000 Milky Way panorama by S. Brunier,
// published under CC BY 4.0 with required credit "ESO/S. Brunier".
// The distributed 18-megapixel TIFF was downsampled to 4096×2048
// and JPEG-encoded at quality 85. See the root ATTRIBUTIONS.md.
//
// Mapped via EquirectangularReflectionMapping (three.js's plate-carrée
// reader), tagged sRGB so the renderer linearises on sample then re-
// encodes on output. With Canvas tone-mapping disabled (flat prop on
// the parent), this preserves the source colors 1:1.

// Version suffix in the filename lets _headers cache this immutably the
// same way the preset clips are: bump to -v3 when the texture is replaced.
const SKYBOX_PATH = "/textures/skybox/skybox-full-v2.jpg";

export function Skybox() {
  // onLoad fires once in a useLayoutEffect inside useTexture, before the
  // returned texture is consumed by render — the canonical drei seam for
  // setting non-default texture properties without violating React 19's
  // immutability rule.
  const onLoad = useCallback((texture: Texture) => {
    texture.mapping = EquirectangularReflectionMapping;
    texture.colorSpace = SRGBColorSpace;
  }, []);

  const texture = useTexture(SKYBOX_PATH, onLoad);

  return <primitive attach="background" object={texture} />;
}
