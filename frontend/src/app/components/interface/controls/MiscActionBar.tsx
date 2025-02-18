import React from "react";
import IconButton from "@mui/material/IconButton";
import GridOnIcon from "@mui/icons-material/GridOn";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import {
  cycleSimulationScale,
  toggleShowAxes,
  toggleShowGrid,
  toggleShowPlanetInfoOverlay,
} from "@/app/store/slices/SimulationSlice";
import Box from "@mui/material/Box";

const GridButton: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <Box>
      <IconButton
        color="primary"
        onClick={() => {
          dispatch(toggleShowGrid());
        }}
      >
        <GridOnIcon />
      </IconButton>
      <IconButton
        color="primary"
        onClick={() => {
          dispatch(toggleShowAxes());
        }}
      >
        <ImportExportIcon />
      </IconButton>
      <IconButton
        color="primary"
        onClick={() => {
          dispatch(cycleSimulationScale());
        }}
      >
        <AspectRatioIcon />
      </IconButton>
      <IconButton
        color="primary"
        onClick={() => {
          dispatch(toggleShowPlanetInfoOverlay());
        }}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default GridButton;
