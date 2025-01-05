import React from 'react';
import {Box, Typography} from '@mui/material';
import SimParams from "@/app/components/interface/SimParams";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store/Store";
import TimeControls from "@/app/components/interface/TimeControls";
import Scene from "@/app/components/scene/Scene";
import ProgressBar from "@/app/components/interface/ProgressBar";
import DataSizeDisplay from "@/app/components/interface/DataSizeDisplay";
import UpdateModal from "@/app/components/interface/UpdateModal";
import CurrentTimeStepDisplay from "@/app/components/interface/CurrentTimeStepDisplay";
import DevMetrics from "@/app/components/interface/DevMetrics";

const Layout: React.FC = () => {
    const sessionID = useSelector((state: RootState) => state.simulation.simulationParameters?.simulationMetaData.sessionID);

    return (
        <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {/* Parent box to ensure Scene fills whole view; z layer 1*/}
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                {/* Child box if specific styling needed */}
                <Box sx={{ width: '100%', height: '100%' }}>
                    <Scene />
                </Box>
            </Box>

            {/* Parent box to ensure UI fills whole view; z layer 2 */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}>
                <UpdateModal />
                {/* Time Controls */}
                <Box sx={{ position: 'absolute', top: 20, left: 20, pointerEvents: 'auto' }}>
                    <ProgressBar />
                    <CurrentTimeStepDisplay />

                    <TimeControls />
                </Box>
                <Box sx={{ position: 'absolute', top: 20, left: 300, pointerEvents: 'auto' }}>
                        <DevMetrics />
                </Box>

                {/* Session ID */}
                <Box sx={{ position: 'absolute', bottom: 20, left: 20, pointerEvents: 'auto' }}>
                    <Typography variant="h6" component="div">
                        {sessionID ? `Session ID: ${sessionID}` : "No Session ID available"}
                    </Typography>
                </Box>

                {/* SimParams (e.g., on the right side) */}
                <Box sx={{ position: 'absolute', top: 20, right: 20, width: '25%', pointerEvents: 'auto' }}>
                    <SimParams />
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;