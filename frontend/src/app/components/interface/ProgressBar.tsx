import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/Store";
import {
  selectCurrentTimeStepIndex,
  selectTotalTimeSteps,
} from "@/app/store/slices/SimulationSlice";

const ProgressBar: React.FC = () => {
  const currentTimeStepIndex = useSelector(selectCurrentTimeStepIndex);
  const totalTimeSteps = useSelector(selectTotalTimeSteps);

  const progress =
    totalTimeSteps > 1
      ? (currentTimeStepIndex / (totalTimeSteps - 1)) * 100
      : 0;

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="subtitle1" gutterBottom color="white">
        Simulation Progress: {Math.round(progress)}%
      </Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

export default ProgressBar;
