import React, { useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { setActiveBody } from "@/app/store/slices/SimulationSlice";
import { RootState } from "@/app/store/Store";

import MercuryIcon from "@/assets/icons/mercury.png";
import VenusIcon from "@/assets/icons/venus.png";
import EarthIcon from "@/assets/icons/earth.png";
import MarsIcon from "@/assets/icons/mars.png";
import JupiterIcon from "@/assets/icons/jupiter.png";
import SaturnIcon from "@/assets/icons/saturn.png";
import UranusIcon from "@/assets/icons/uranus.png";
import NeptuneIcon from "@/assets/icons/neptune.png";
import MoonIcon from "@/assets/icons/moon.png";
import SunIcon from "@/assets/icons/sun.png";

import { StaticImageData } from "next/image";

const planetIcons: Record<string, StaticImageData> = {
  MERCURY: MercuryIcon as StaticImageData,
  VENUS: VenusIcon as StaticImageData,
  EARTH: EarthIcon as StaticImageData,
  MARS: MarsIcon as StaticImageData,
  JUPITER: JupiterIcon as StaticImageData,
  SATURN: SaturnIcon as StaticImageData,
  URANUS: UranusIcon as StaticImageData,
  NEPTUNE: NeptuneIcon as StaticImageData,
  MOON: MoonIcon as StaticImageData,
  SUN: SunIcon as StaticImageData,
};

const PlanetSelector: React.FC = () => {
  const dispatch = useDispatch();
  const bodies =
    useSelector(
      (state: RootState) => state.simulation.currentSimulationSnapshot,
    ) || [];

  useEffect(() => {
    console.log("PlanetSelector - current bodies snapshot:", bodies);
  }, [bodies]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: "5%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 1,
        borderRadius: 2,
        width: { xs: "90%", sm: "25%" },
        // height: { xs: "90%", sm: "100px" },
      }}
    >
      {bodies.map((body) => {
        const iconData = planetIcons[body.name.toUpperCase()];
        console.log(
          `PlanetSelector - rendering icon for: ${body.name}`,
          iconData,
        );

        return (
          <IconButton
            key={body.name}
            onClick={() => {
              console.log("PlanetSelector - clicked body:", body);
              dispatch(setActiveBody(body));
            }}
            sx={{
              m: "0 10px",
              width: { xs: "90%", sm: "10%" },
              // height: { xs: "90%", sm: "100px" },
              p: 0, // remove default padding
            }}
          >
            <Box
              component="img"
              src={iconData ? iconData.src : body.iconUrl}
              alt={body.name}
              sx={{
                aspectRatio: "1/1",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </IconButton>
        );
      })}
    </Box>
  );
};

export default PlanetSelector;
