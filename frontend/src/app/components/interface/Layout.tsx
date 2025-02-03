import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/Store";

// Import your components
import Scene from "@/app/components/scene/Scene";
import MiniDrawer from "@/app/components/interface/drawer/MiniDrawer";
import ProgressBar from "@/app/components/interface/ProgressBar";
import TimeControls from "@/app/components/interface/TimeControls";
import CurrentTimeStepDisplay from "@/app/components/interface/CurrentTimeStepDisplay";
import DevMetrics from "@/app/components/interface/drawer/components/DevMetrics";
import UpdateModal from "@/app/components/interface/UpdateModal";

const Layout: React.FC = () => {
  // Example: retrieving a session ID from Redux state
  const sessionID = useSelector(
    (state: RootState) =>
      state.simulation.simulationParameters?.simulationMetaData.sessionID,
  );

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 3D Scene */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "black",
          }}
        >
          <Scene />
        </Box>

        {/* UI Overlays */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2, // Above the scene
            width: "100%",
          }}
        >
          <UpdateModal />
          <MiniDrawer />

          {/* Time controls, progress bar, and current step display */}
          <Box sx={{ position: "absolute", top: 20, left: 300 }}>
            <ProgressBar />
            <CurrentTimeStepDisplay />
            <TimeControls />
          </Box>

          {/* Session ID in the bottom-left corner */}
          <Box sx={{ position: "absolute", bottom: 20, left: 20 }}>
            <Typography variant="h6" component="div">
              {sessionID
                ? `Session ID: ${sessionID}`
                : "No Session ID available"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
