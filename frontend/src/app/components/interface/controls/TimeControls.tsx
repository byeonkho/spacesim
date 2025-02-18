import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/Store";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import {
  selectCurrentTimeStepIndex,
  selectCurrentTimeStepKey,
  selectTotalTimeSteps,
  setSpeedMultiplier,
  togglePause,
} from "@/app/store/slices/SimulationSlice";
import { FastForward, FastRewind, Pause, PlayArrow } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";

const TimeControls: React.FC = () => {
  const dispatch = useDispatch();
  const currentTimeStepIndex: number = useSelector(selectCurrentTimeStepIndex);
  const totalTimeSteps: number = useSelector(selectTotalTimeSteps);

  const progress: number =
    totalTimeSteps > 1
      ? (currentTimeStepIndex / (totalTimeSteps - 1)) * 100
      : 0;

  const { isPaused, speedMultiplier } = useSelector(
    (state: RootState) => state.simulation.timeState,
  );
  const theme = useTheme();

  return (
    <Card
      sx={{
        ...theme.mixins.glass,
        height: { xs: "200px", sm: "250px", md: "120px" },
        width: "350px",
        margin: "0 auto",
        justifyContent: "center",
        textAlign: "center",
        padding: 0,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // gap: 1,
        }}
      >
        <Typography variant="h3" sx={{ mb: 1 }}>
          {speedMultiplier}x
        </Typography>
        <Box
          sx={{
            padding: 0,
            margin: 0,
            mt: -1,
          }}
        >
          <IconButton
            color="primary"
            onClick={() => dispatch(setSpeedMultiplier("decrease"))}
            size="large"
          >
            <FastRewind />
          </IconButton>
          {/* Play / Pause */}
          <IconButton
            color={"primary"}
            onClick={() => dispatch(togglePause())}
            size="large"
          >
            {isPaused ? <PlayArrow /> : <Pause />}
          </IconButton>
          {/* Fast Forward */}
          <IconButton
            color={"primary"}
            onClick={() => dispatch(setSpeedMultiplier("increase"))}
            size="large"
          >
            <FastForward />
          </IconButton>
        </Box>
        <Box sx={{ width: "80%", padding: 0 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimeControls;
