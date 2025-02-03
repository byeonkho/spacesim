import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentTimeStepKey } from "@/app/store/slices/SimulationSlice";

const CurrentTimestepDisplay: React.FC = () => {
  const currentTimeStepKey = useSelector(selectCurrentTimeStepKey);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        maxWidth: "300px",
        backgroundColor: "rgba(255, 255, 255, 0.05)", // very subtle light overlay
        backdropFilter: "blur(4px)", // glassmorphism effect
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
      }}
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
