import React from "react";
import IconButton from "@mui/material/IconButton";
import GridOnIcon from "@mui/icons-material/GridOn";
import { useDispatch } from "react-redux";
import {
  setActiveBody,
  toggleShowGrid,
} from "@/app/store/slices/SimulationSlice";

const GridButton: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <IconButton
      color="primary"
      onClick={() => {
        dispatch(toggleShowGrid());
      }}
      aria-label="Toggle Grid"
    >
      <GridOnIcon />
    </IconButton>
  );
};

export default GridButton;
