import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentTimeStepKey } from "@/app/store/slices/SimulationSlice";

const CurrentTimestepDisplay: React.FC = () => {
  const currentTimeStepKey = useSelector(selectCurrentTimeStepKey);

  return (
    <Box
      sx={(theme) => ({
        ...theme.mixins.glass, // Apply your glass mixin styles
        // maxWidth: "100px", // Additional styles can be added here
      })}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Current Timestep
      </Typography>
      <Typography variant="body1" sx={{ letterSpacing: 0.5 }}>
        {currentTimeStepKey}
      </Typography>
    </Box>
  );
};

export default CurrentTimestepDisplay;
