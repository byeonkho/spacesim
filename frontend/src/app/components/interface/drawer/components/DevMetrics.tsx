import React from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentTimeStepIndex,
  selectTotalTimeSteps,
} from "@/app/store/slices/SimulationSlice";
import { Box, Paper, Typography } from "@mui/material";
import DataSizeDisplay from "@/app/components/interface/drawer/components/DataSizeDisplay";
import theme from "@/muiTheme";

const DevMetrics: React.FC = () => {
  // Selectors for metrics
  const totalTimeSteps = useSelector(selectTotalTimeSteps);
  const currentTimeStepIndex = useSelector(selectCurrentTimeStepIndex);

  const remainingIndexes = totalTimeSteps - currentTimeStepIndex;

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        height: "100%",
        padding: 2,
        backgroundColor: theme.palette.background.default,
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Developer Metrics
      </Typography>
      <Box>
        <Typography variant="body1">
          <strong>Total Time Steps:</strong> {totalTimeSteps}
        </Typography>
        <Typography variant="body1">
          <strong>Current Time Step Index:</strong> {currentTimeStepIndex}
        </Typography>
        <Typography variant="body1">
          <strong>Remaining Indexes:</strong> {remainingIndexes}
        </Typography>
        <DataSizeDisplay />
      </Box>
    </Paper>
  );
};

export default DevMetrics;
