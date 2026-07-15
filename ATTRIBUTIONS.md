# Attribution and third-party notices

The repository's root `LICENSE` covers original source code authored for
nbodysim unless a file or notice says otherwise. It does not relicense the
third-party material listed here. Each third-party item remains under its own
terms.

This file focuses on material redistributed in the repository. Package-manager
dependencies keep their own notices in their packages and metadata.

## Sky imagery

`frontend/public/textures/skybox/skybox-full-v1.jpg`

- Work: [NASA SVS Deep Star Maps 2020](https://svs.gsfc.nasa.gov/4851/),
  visualized by **Ernie Wright** from Hipparcos-2, Tycho-2, Gaia Data Release
  2, and additional catalogues.
- Requested credit: **NASA/Goddard Space Flight Center Scientific
  Visualization Studio. Gaia DR2: ESA/Gaia/DPAC.**
- License caveat: Gaia data are distributed under
  [CC BY-NC 3.0 IGO](https://www.cosmos.esa.int/web/gaia-users/license).
  The restored skybox is therefore for noncommercial use unless ESA grants
  separate commercial authorization under its
  [archive terms](https://www.cosmos.esa.int/web/esdc/terms-and-conditions).
- Changes: the 8192 x 4096 EXR was tone-mapped from linear to sRGB,
  downsampled to 4096 x 2048, and JPEG-encoded at quality 85. The small base64
  placeholder in `frontend/src/app/components/scene/Layout.tsx` is a blurred
  64 x 32 derivative of this file.

## Solar System Scope textures

The following textures come from the
[Solar System Scope texture pack](https://www.solarsystemscope.com/textures/)
under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Credit: **Solar System Scope**.

| Repository file | Solar System Scope file | Changes in this repository |
| --- | --- | --- |
| `mercury_texture.jpg` | [`2k_mercury.jpg`](https://www.solarsystemscope.com/textures/download/2k_mercury.jpg) | None; byte-identical download |
| `venus_texture.jpg` | [`4k_venus_atmosphere.jpg`](https://www.solarsystemscope.com/textures/download/4k_venus_atmosphere.jpg) | None; byte-identical atmosphere texture |
| `earth_texture.jpg` | [`8k_earth_daymap.jpg`](https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg) | Resized to 2048 x 1024 and JPEG-recompressed at quality 85 |
| `mars_texture.jpg` | [`8k_mars.jpg`](https://www.solarsystemscope.com/textures/download/8k_mars.jpg) | Resized to 2048 x 1024 and JPEG-recompressed at quality 85 |
| `jupiter_texture.jpg` | [`8k_jupiter.jpg`](https://www.solarsystemscope.com/textures/download/8k_jupiter.jpg) | None; byte-identical download |
| `saturn_texture.jpg` | [`8k_saturn.jpg`](https://www.solarsystemscope.com/textures/download/8k_saturn.jpg) | None; byte-identical download |
| `uranus_texture.jpg` | [`2k_uranus.jpg`](https://www.solarsystemscope.com/textures/download/2k_uranus.jpg) | None; byte-identical download |
| `neptune_texture.jpg` | [`2k_neptune.jpg`](https://www.solarsystemscope.com/textures/download/2k_neptune.jpg) | None; byte-identical download |
| `sun_texture.jpg` | [`8k_sun.jpg`](https://www.solarsystemscope.com/textures/download/8k_sun.jpg) | None; byte-identical download |
| `moon_texture.jpg` | [`2k_moon.jpg`](https://www.solarsystemscope.com/textures/download/2k_moon.jpg) | None; byte-identical download |

## Minor bodies

| Repository file or rendering | Body | Source and terms | Changes and notes |
| --- | --- | --- | --- |
| `pluto.jpg` | Pluto | [Steve Albers' Planetary Maps](https://stevealbers.net/albers/sos/sos.html), under his [personal, noncommercial terms](https://stevealbers.net/albers/sos/sos.html.new) | Derived from NASA New Horizons imagery and downsampled to 2048 x 1024 JPEG. |
| `ceres.jpg` | Ceres | [Steve Albers' Planetary Maps](https://stevealbers.net/albers/sos/sos.html), under his [personal, noncommercial terms](https://stevealbers.net/albers/sos/sos.html.new) | Derived from NASA Dawn imagery and downsampled to 2048 x 1024 JPEG. |
| `vesta.jpg` | Vesta | [Steve Albers' Planetary Maps](https://stevealbers.net/albers/sos/sos.html), under his [personal, noncommercial terms](https://stevealbers.net/albers/sos/sos.html.new) | Derived from NASA Dawn imagery and downsampled to 2048 x 1024 JPEG. |
| `eros.jpg` | Eros | [NASA PDS Stooke Small Bodies Maps](https://pds.nasa.gov/ds-view/pds/viewProfile.jsp?dsid=MULTI-SA-MULTI-6-STOOKEMAPS-V2.0) | NEAR Shoemaker mosaic, downsampled to 2048 x 1024 JPEG. The exact redistribution grant for the bundled derivative has not been independently verified. |
| `bennu.jpg` | Bennu | [NASA OSIRIS-REx global mosaic](https://www.asteroidmission.org/wp-content/uploads/2020/03/Bennu_Global_Mosaic.png) | Downsampled to 2048 x 1024 JPEG. Credit: **NASA/Goddard/University of Arizona**. The exact redistribution grant for the bundled derivative has not been independently verified. |
| `ryugu.jpg` | Ryugu | [Hayabusa2 ONC global map](https://data.darts.isas.jaxa.jp/pub/hayabusa2/products/01_GlobalMap1/hyb2_onc_Global_01_l3dm_v06.jpg), governed by the [ISAS Data Policy](https://www.isas.jaxa.jp/en/researchers/data-policy/) | Resized from 3600 x 1800 to 2048 x 1024 and JPEG-recompressed. Origin: **ISAS/JAXA**. Contributors: JAXA, University of Tokyo, Kochi University, Rikkyo University, Nagoya University, Chiba Institute of Technology, Meiji University, University of Aizu, AIST. |
| `fallback.jpg` | Pallas, Hygiea, Apophis | Project-authored procedural texture | No separate third-party image is bundled for these bodies. |

## Moons

The files below are resized and JPEG-recompressed derivatives of the linked
USGS Astrogeology products. The [USGS copyright policy](https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits)
places USGS-authored or produced data and information in the U.S. public
domain unless marked otherwise. Each product record's more specific access,
use, and credit instructions are reproduced below. The files were normalized
to 2048 x 1024 at JPEG quality 85.

| Repository file | Body and source product | Recorded terms and credit |
| --- | --- | --- |
| `phobos.jpg` | [Phobos Viking Global Mosaic 5m](https://astrogeology.usgs.gov/search/map/phobos_viking_global_mosaic_5m) | Public domain; cite primary author **Phil Stooke** and note DLR control |
| `io.jpg` | [Io Galileo SSI / Voyager Color Merged Global Mosaic 1km](https://astrogeology.usgs.gov/search/map/io_galileo_ssi_voyager_color_merged_global_mosaic_1km) | Public domain; credit **USGS Astrogeology Science Center** |
| `europa.jpg` | [Europa Voyager - Galileo SSI Global Mosaic 500m](https://astrogeology.usgs.gov/search/map/europa_voyager_galileo_ssi_global_mosaic_500m) | Access and use constraints: none; primary author **Tammy Becker**; originators **B. Archinal, T. Colvin, M. Davies, A. Gitlin, R. Kirk, and L. Weller**; published by USGS Astrogeology |
| `ganymede.jpg` | [Ganymede Voyager - Galileo SSI Color Global Mosaic 1.4km](https://astrogeology.usgs.gov/search/map/ganymede_voyager_galileo_ssi_color_global_mosaic_1_4km) | Public domain; credit **USGS Astrogeology Science Center** |
| `callisto.jpg` | [Callisto Galileo/Voyager Global Mosaic 1km](https://astrogeology.usgs.gov/search/map/callisto_galileo_voyager_global_mosaic_1km) | Public domain; credit **USGS Astrogeology Science Center** |
| `enceladus.jpg` | [Enceladus Cassini Global Mosaic 110m](https://astrogeology.usgs.gov/search/map/enceladus_cassini_global_mosaic_110m) | Public domain; cite the **Cassini Team, Jet Propulsion Laboratory, and Space Science Institute** |
| `tethys.jpg` | [Tethys Cassini Global Mosaic 293m](https://astrogeology.usgs.gov/search/map/tethys_cassini_global_mosaic_293m) | Public domain; cite **T. Roatsch, E. Kersten, A. Hoffmeister, and M. Wahlisch**, with NASA/JPL/Space Science Institute origin |
| `dione.jpg` | [Dione Cassini - Voyager Global Mosaic 154m](https://astrogeology.usgs.gov/search/map/dione_cassini_voyager_global_mosaic_154m) | Public domain; cite **NASA, JPL, and Space Science Institute** |
| `rhea.jpg` | [Rhea Cassini - Voyager Global Mosaic 417m](https://astrogeology.usgs.gov/search/map/rhea_cassini_voyager_global_mosaic_417m) | Public domain; cite **T. Roatsch, E. Kersten, A. Hoffmeister, and M. Wahlisch**, with NASA/JPL/Space Science Institute origin |
| `titan.jpg` | [Titan Cassini ISS Global Mosaic 4005m](https://astrogeology.usgs.gov/search/map/titan_cassini_iss_global_mosaic_4005m) | Access constraints: none; cite the **Cassini ISS Team** and **NASA/JPL-Caltech/Space Science Institute** |
| `iapetus.jpg` | [Iapetus Cassini - Voyager Global Mosaic 803m](https://astrogeology.usgs.gov/search/map/iapetus_cassini_voyager_global_mosaic_803m) | Public domain; cite **Space Science Institute, Cassini Team, and Jet Propulsion Laboratory** |
| `triton.jpg` | [Triton Voyager 2 Global Color Mosaic 600m](https://astrogeology.usgs.gov/search/map/triton_voyager_2_global_color_mosaic_600m) | Public domain; cite **Lunar and Planetary Institute, NASA, JPL, and Dr. Paul Schenk** |
| `charon.jpg` | [Charon New Horizons LORRI MVIC Global Mosaic 300m](https://astrogeology.usgs.gov/search/map/charon_new_horizons_lorri_mvic_global_mosaic_300m) | Access constraints: none; cite the **New Horizons Team**, NASA, Johns Hopkins University Applied Physics Laboratory, Southwest Research Institute, and Lunar and Planetary Institute |
| `fallback.jpg` | Deimos, Mimas, Ariel, Umbriel, Titania, Oberon, Miranda, Nereid | Project-authored procedural texture; no separate third-party image is bundled |

## Project-authored images

- `assets/hero.gif` is a screen capture of nbodysim created for this project.
- `frontend/src/app/icon.svg` was created for this project.
- `frontend/public/textures/fallback.jpg` is a neutral rocky texture generated
  for this project with ImageMagick and no third-party image input.

These project-authored files are covered by the root AGPL-3.0-only grant.

## Fonts

`packages/ui/src/styles/fonts.css` embeds the following font software as base64
WOFF2 data:

- Inter Variable, Copyright 2016 The Inter Project Authors, under the
  [SIL Open Font License 1.1](LICENSES/Inter-OFL-1.1.txt).
- JetBrains Mono Variable, Copyright 2020 The JetBrains Mono Project Authors,
  under the [SIL Open Font License 1.1](LICENSES/JetBrains-Mono-OFL-1.1.txt).

The embedded font software remains under the OFL and is not relicensed under
the AGPL.

## Astronomy data

`backend/src/main/resources/orekit-data-master/` is a redistributed snapshot of
the [Orekit data convenience archive](https://gitlab.orekit.org/orekit/orekit-data).
It aggregates data from JPL, IERS, NASA, and other scientific producers. The
repository's AGPL license does not relicense those data; their source-specific
notices and terms continue to apply.
