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
import PlanetInfoOverlay from "@/app/components/scene/PlanetInfoOverlay";
import BodySelector from "@/app/components/interface/BodySelector";
import CurrentTimeStep from "@/app/components/interface/CurrentTimeStep";

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
            zIndex: 1, // Above the scene
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              pointerEvents: "auto",
            }}
          >
            <BodySelector />
          </Box>

          <Box
            sx={{
              pointerEvents: "auto",
            }}
          >
            <MiniDrawer />
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              // maxWidth: "350px",
              p: 0,
              pointerEvents: "auto",
            }}
          >
            <TimeControls />
          </Box>

          <UpdateModal />

          {/* Time controls, progress bar */}
          <Box sx={{ position: "absolute", top: 20, right: 50 }}>
            <CurrentTimeStep />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
