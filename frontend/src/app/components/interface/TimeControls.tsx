import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/store/Store";
import {Box, IconButton, Typography} from "@mui/material";
import {setSpeedMultiplier, togglePause} from "@/app/store/slices/SimulationSlice";
import {FastForward, FastRewind, Pause, PlayArrow} from "@mui/icons-material";

const TimeControls: React.FC = () => {
    const dispatch = useDispatch();
    const {isPaused, speedMultiplier} = useSelector((state: RootState) => state.simulation.timeState);

    return (
        <Box sx={{ width: '100%', maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: 2 }}>
            {/*<Typography variant="h6">*/}
            {/*    Simulation Progress*/}
            {/*</Typography>*/}
            {/*<Slider*/}
            {/*    value={progress || 0}*/}
            {/*    onChange={handleProgressChange}*/}
            {/*    aria-labelledby="simulation-progress"*/}
            {/*    valueLabelDisplay="auto"*/}
            {/*    sx={{ marginTop: 2 }}*/}
            {/*/>*/}

            <Typography variant="body1" sx={{ marginTop: 2 }}>
                Current Speed: {speedMultiplier}x
            </Typography>

            {/*Fast Rewind*/}
            <IconButton
                color={"primary"}
                onClick={() => dispatch(setSpeedMultiplier("decrease"))}
                disabled={setSpeedMultiplier <= -8}
                sx={{ marginTop: 2 }}
                size="large"
            >
                <FastRewind/>
            </IconButton>

            {/* Play / Pause */}
            <IconButton
                color={"primary"}
                onClick={() => dispatch(togglePause())}
                sx={{ marginTop: 2 }}
                size="large"
            >
                {isPaused ? <PlayArrow /> : <Pause />}
            </IconButton>

            {/* Fast Forward */}
            <IconButton
                color={"primary"}
                onClick={() => dispatch(setSpeedMultiplier("increase"))}
                disabled={setSpeedMultiplier >= 8}
                sx={{ marginTop: 2 }}
                size="large"
            >
                <FastForward/>
            </IconButton>
        </Box>
    );
};

export default TimeControls;
