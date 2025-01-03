import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/Store';

const ProgressBar: React.FC = () => {
    const simulationData = useSelector((state: RootState) => state.simulation.simulationData);
    const currentTimeStepIndex = useSelector((state: RootState) => state.simulation.timeState?.currentTimeStepIndex || 0);

    // Calculate progress
    const totalTimeSteps = simulationData ? Object.keys(simulationData).length : 0;
    const progress = totalTimeSteps > 1 ? (currentTimeStepIndex / (totalTimeSteps - 1)) * 100 : 0;

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
                Simulation Progress: {Math.round(progress)}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
        </Box>
    );
};

export default ProgressBar;
