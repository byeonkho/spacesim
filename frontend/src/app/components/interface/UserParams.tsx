import React, {useState} from 'react';
import {
    Box,
    Button,
    Drawer,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import {initializeCelestialBodies} from "@/app/utils/initializeCelestialBodies";
import theme from "@/muiTheme";
import {RootState, store} from "@/app/store/Store";
import {connect, disconnect, requestRunSimulation, sendMessage} from "@/app/store/middleware/webSocketMiddleware";
import SimulationSlice, {selectSessionID} from "@/app/store/slices/SimulationSlice";

const UserParams: React.FC = () => {
    const dispatch = useDispatch();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [celestialBodyNames, setCelestialBodyNames] = useState<string[]>([])
    const [date, setDate] = useState<string>('2024-06-05T00:00:00.000');
    const [frame, setFrame] = useState<string>('Heliocentric');
    const [integrator, setIntegrator] = useState<string>('euler');
    const [timeStep, setTimeStep] = useState<string>("Hours");


    const handleCelestialBodyNamesChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setCelestialBodyNames(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            // Validate input
            validateString(timeStep);

            console.log("Input is valid:", timeStep);

            // Step 1: Initialize celestial bodies
            const requestBody = {
                celestialBodyNames,
                date,
                frame,
                integrator,
            };

            console.log("Initializing celestial bodies...");
            await initializeCelestialBodies(dispatch, requestBody);
            console.log("Celestial bodies initialized successfully.");

            const sessionID = store.getState().simulation.simulationParameters?.simulationMetaData?.sessionID;
            // Step 2: Init websocket
            await initializeWebSocket()

            // Step 3: Send WebSocket message
            const requestData = {
                timeStep,
                sessionID,
            };
            console.log("Sending WebSocket request:", requestData);
            dispatch(requestRunSimulation(requestData));
        } catch (error) {
            // Log or handle errors
            if (error instanceof Error) {
                console.error("Form submission error:", error.message);
                alert(error.message); // Optionally show an alert to the user
            } else {
                console.error("An unknown error occurred during form submission.");
            }
        }
    };

    // const waitForSessionID = (): Promise<void> => {
    //     return new Promise((resolve, reject) => {
    //         const timeout = 5000; // Maximum wait time in milliseconds
    //         const interval = 50; // Check every 50ms
    //         let elapsed = 0;
    //
    //         const intervalId = setInterval(() => {
    //             const currentSessionID = store.getState().simulation.simulationParameters?.simulationMetaData?.sessionID; // Access updated state
    //
    //             console.log("Debug sessionID:", currentSessionID);
    //             if (currentSessionID) {
    //                 clearInterval(intervalId);
    //                 resolve();
    //             } else {
    //                 elapsed += interval;
    //                 if (elapsed >= timeout) {
    //                     clearInterval(intervalId);
    //                     reject(new Error("Session ID not initialized within the timeout period."));
    //                 }
    //             }
    //         }, interval);
    //     });
    // };


    const handleTimeStepChange = (e: SelectChangeEvent<string>) => {
        setTimeStep(e.target.value);
    };

    function validateString(input: string) {
        const validOptions = ["Seconds", "Hours", "Days", "Weeks"];
        if (!validOptions.includes(input)) {
            throw new Error(`Invalid time step. Please select one of: ${validOptions.join(", ")}.`);
        }
        return true; // If all validations pass
    }

    // TODO use .env
    const initializeWebSocket = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            const url = 'ws://localhost:8080/ws';
            dispatch(connect(url));

            const interval = setInterval(() => {
                const isConnected = store.getState().webSocket.isConnected
                if (isConnected) {
                    clearInterval(interval);
                    resolve(); // Resolve the promise once connected
                }
            }, 50); // Poll every 50ms

            // Timeout after 5 seconds if the connection isn't established
            setTimeout(() => {
                const isConnected = store.getState().webSocket.isConnected
                clearInterval(interval);
                if (!isConnected) {
                    reject(new Error('Failed to establish WebSocket connection within the timeout period.'));
                }
            }, 5000);
        });
    };

    const handleCloseWebSocket = () => {
        dispatch(disconnect());
    };

    const toggleDrawer = (open: boolean) => (event: React.MouseEvent) => {
        setDrawerOpen(open);
    };

    return (
        <div>
            <IconButton
                edge="start"
                color="default"
                aria-label="open drawer"
                onClick={toggleDrawer(true)}
                sx={{ marginLeft: 'auto' }} // Adjust to position the button
            >
                <MenuIcon />
            </IconButton>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{
                        height: '100%',
                        padding: 2,
                        backgroundColor: theme.palette.background.paper,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                    role="presentation"
                >
                    <FormControl fullWidth>
                        <InputLabel>Celestial Bodies</InputLabel>
                        <Select
                            multiple
                            value={celestialBodyNames}
                            onChange={handleCelestialBodyNamesChange}
                            label="Celestial Bodies"
                        >
                            <MenuItem value="Earth">Earth</MenuItem>
                            <MenuItem value="Mars">Mars</MenuItem>
                            <MenuItem value="Venus">Venus</MenuItem>
                            <MenuItem value="Jupiter">Jupiter</MenuItem>
                            <MenuItem value="Sun">Sun</MenuItem>
                            {/* Add more celestial bodies as needed */}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Date"
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        label="Frame"
                        value={frame}
                        onChange={(e) => setFrame(e.target.value)}
                    />

                    <TextField
                        label="Integrator"
                        value={integrator}
                        onChange={(e) => setIntegrator(e.target.value)}
                    />

                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="time-unit-label">Time Unit</InputLabel>
                            <Select
                                labelId="time-unit-label"
                                value={timeStep}
                                onChange={handleTimeStepChange}
                            >
                                <MenuItem value="Seconds">Seconds</MenuItem>
                                <MenuItem value="Hours">Hours</MenuItem>
                                <MenuItem value="Days">Days</MenuItem>
                                <MenuItem value="Weeks">Weeks</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ width: '100%' }}
                        onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>

            </Drawer>
        </div>
    );
};

export default UserParams;