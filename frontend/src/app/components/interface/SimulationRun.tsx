import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Box } from '@mui/material';
import { requestRunSimulation } from "@/app/store/middleware/webSocketMiddleware";
import { RootState } from "@/app/store/Store";

const WebSocketDataSender: React.FC = () => {
    const dispatch = useDispatch();

    // State to store the form data
    const [totalTime, setTotalTime] = useState<number>(0);
    const [deltaTime, setDeltaTime] = useState<number>(0);
    const sessionID = useSelector((state: RootState) => state.simulation.simulationParameters?.simulationMetadata.sessionID);

    // Handle form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        try {
            // Validate the input values
            if (!totalTime || totalTime <= 0) {
                throw new Error("Total time must be a positive number.");
            }
            if (!deltaTime || deltaTime <= 0) {
                throw new Error("Delta time must be a positive number.");
            }
            if (!sessionID) {
                throw new Error("Session ID is required.");
            }

            // Prepare the data as per WebSocketRequestDTO
            const requestData = {
                totalTime,
                deltaTime,
                sessionID
            };

            console.log("Request data:", requestData);

            // Dispatch the sendMessage action to send data over the WebSocket
            dispatch(requestRunSimulation(requestData));
            console.log("Request sent successfully.");
        } catch (error: unknown) {
            // Log or handle errors
            if (error instanceof Error) {
                console.error("Form submission error:", error.message);
                alert(error.message); // Optionally show an alert to the user
            } else {
                console.error("An unknown error occurred during form submission.");
            }
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Total Time"
                type="number"
                value={totalTime}
                onChange={(e) => setTotalTime(Math.max(0, parseFloat(e.target.value)))} // Prevent negatives
                inputProps={{ min: 0 }} // Enforce min value in the UI
                fullWidth
            />
            <TextField
                label="Delta Time"
                type="number"
                value={deltaTime}
                onChange={(e) => setDeltaTime(Math.max(0, parseFloat(e.target.value)))} // Prevent negatives
                inputProps={{ min: 0 }} // Enforce min value in the UI
                fullWidth
            />
            <Button variant="contained" color="primary" type="submit">
                Send Data
            </Button>
        </Box>
    );
};

export default WebSocketDataSender;
