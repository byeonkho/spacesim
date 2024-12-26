import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Box, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import { requestRunSimulation } from "@/app/store/middleware/webSocketMiddleware";
import { RootState } from "@/app/store/Store";

const WebSocketDataSender: React.FC = () => {
    const dispatch = useDispatch();

    // State to store the form data
    const [timeStep, setTimeStep] = useState<string>("Hours");
    const sessionID = useSelector((state: RootState) => state.simulation.simulationParameters?.simulationMetaData?.sessionID);

    // Handle form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        try {
            // Validate the input values
            validateString(timeStep);
            console.log("Input is valid:", timeStep);

            // Prepare the data as per WebSocketRequestDTO
            if (!sessionID) {
                throw new Error("Session ID is required.");
            }

            const requestData = {
                timeStep,
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

    const handleChange = (e: SelectChangeEvent<string>) => {
        setTimeStep(e.target.value);
    };

    function validateString(input: string) {
        const validOptions = ["Seconds", "Hours", "Days", "Weeks"];
        if (!validOptions.includes(input)) {
            throw new Error(`Invalid time step. Please select one of: ${validOptions.join(", ")}.`);
        }
        return true; // If all validations pass
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
                <InputLabel id="time-unit-label">Time Unit</InputLabel>
                <Select
                    labelId="time-unit-label"
                    value={timeStep}
                    onChange={handleChange}
                >
                    <MenuItem value="Seconds">Seconds</MenuItem>
                    <MenuItem value="Hours">Hours</MenuItem>
                    <MenuItem value="Days">Days</MenuItem>
                    <MenuItem value="Weeks">Weeks</MenuItem>
                </Select>
            </FormControl>

            <Button variant="contained" color="primary" type="submit">
                Send Data
            </Button>
        </Box>
    );
};

export default WebSocketDataSender;
