import React from "react";
import IconButton from "@mui/material/IconButton";
import GridOnIcon from "@mui/icons-material/GridOn";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { useDispatch } from "react-redux";
import {
  cycleSimulationScale,
  setActiveBody,
  toggleShowAxes,
  toggleShowGrid,
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
    </Box>
  );
};

export default GridButton;
