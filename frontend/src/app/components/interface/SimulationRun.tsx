import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { TextField, Button, Box } from '@mui/material';
import {requestRunSimulation, sendMessage} from "@/app/store/middleware/webSocketMiddleware";
import {RootState} from "@/app/store/Store";

const WebSocketDataSender: React.FC = () => {
    const dispatch = useDispatch();

    // State to store the form data
    const [totalTime, setTotalTime] = useState<number>(0);
    const [deltaTime, setDeltaTime] = useState<number>(0);
    const sessionID = useSelector((state: RootState) => state.simulation.simulationData?.sessionID);

    // Handle form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Prepare the data as per WebsocketRequestDTO
        const requestData = {
            totalTime,
            deltaTime,
            sessionID
        };

        // Dispatch the sendMessage action to send data over the WebSocket
        dispatch(requestRunSimulation(requestData));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Total Time"
                type="number"
                value={totalTime}
                onChange={(e) => setTotalTime(parseFloat(e.target.value))}
                fullWidth
            />
            <TextField
                label="Delta Time"
                type="number"
                value={deltaTime}
                onChange={(e) => setDeltaTime(parseFloat(e.target.value))}
                fullWidth
            />
            <Button variant="contained" color="primary" type="submit">
                Send Data
            </Button>
        </Box>
    );
};

export default WebSocketDataSender;