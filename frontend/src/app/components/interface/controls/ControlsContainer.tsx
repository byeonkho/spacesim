import React from "react";
import { Box } from "@mui/material";
import TimeControls from "@/app/components/interface/controls/TimeControls";
import MiscActionBar from "@/app/components/interface/controls/MiscActionBar"; // assuming this is your component

const ControlsContainer: React.FC = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "auto",
      }}
    >
      {/* This container is centered, and relatively positioned */}
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <TimeControls />
        {/* Anchor MiscActionBar to the right of TimeControls */}
        <Box
          sx={{
            position: "absolute",
            top: 0, // Align the top edge with TimeControls
            left: "100%", // Place it right next to TimeControls
            ml: 1, // Optional: add horizontal spacing (margin-left)
          }}
        >
          <MiscActionBar />
        </Box>
      </Box>
    </Box>
  );
};

export default ControlsContainer;
