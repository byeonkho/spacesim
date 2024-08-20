// src/components/Layout.tsx

import React from 'react';
import {Grid, Box, Typography} from '@mui/material';
import Interface from "@/app/components/interface/Interface";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store/Store";

const Layout: React.FC = () => {
    const sessionID = useSelector((state: RootState) => state.simulation.simulationParameters?.sessionID);

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <Box>
                    <Box sx={{ padding: 2, borderRadius: 1 }}>
                        <Typography variant="h6" component="div">
                            {sessionID ? `Session ID: ${sessionID}` : "No Session ID available"}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Box>
                    <Interface />
                </Box>
            </Grid>
        </Grid>
    );
};

export default Layout;