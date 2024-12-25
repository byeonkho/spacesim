import React, { useState } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    SelectChangeEvent,
    Drawer,
    IconButton,
    Typography
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import { initializeCelestialBodies } from "@/app/utils/initializeCelestialBodies";
import theme from "@/muiTheme";
import {RootState} from "@/app/store/Store";
import {connect,  disconnect, sendMessage} from "@/app/store/middleware/webSocketMiddleware";
import SimulationRun from "@/app/components/interface/SimulationRun";

const Interface: React.FC = () => {
    const dispatch = useDispatch();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [celestialBodyNames, setCelestialBodyNames] = useState<string[]>([])
    const [date, setDate] = useState<string>('2024-06-05T00:00:00.000');
    const [frame, setFrame] = useState<string>('Heliocentric');
    const [integrator, setIntegrator] = useState<string>('euler');



    const { isConnected } = useSelector((state: RootState) => state.webSocket);

    const handleCelestialBodyNamesChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setCelestialBodyNames(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const requestBody = {
            celestialBodyNames,
            date,
            frame,
            integrator,
        };
        initializeCelestialBodies(dispatch, requestBody);
    };

    // TODO use .env
    const handleInitializeWebSocket = () => {
        dispatch(connect('ws://localhost:8080/ws'));
    };

    const handleCloseWebSocket = () => {
        dispatch(disconnect());
    };

    const handleSendMessage = () => {
        if (isConnected) {
            dispatch(sendMessage({ type: 'message', data: 'Hello from client!' }));
        }
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

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ width: '100%' }}
                        onClick={handleSubmit}>
                        Submit
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleInitializeWebSocket}
                    >
                        Connect WebSocket
                    </Button>

                    <SimulationRun/>
                </Box>
            </Drawer>
        </div>
    );
};

export default Interface;