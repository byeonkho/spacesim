import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Vector3} from "three";

interface TimeControls {
    isPaused: boolean;
    progress: number; // percentage 0 - 100
    speedMultiplier: number;
}

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface CelestialBody {
    bodyName: string;
    position: Vector3;
    velocity: Vector3;
}

interface SimulationMetadata {
    sessionID: string;
}

export interface SimulationData {
    [date: string]: CelestialBody[];
}

export interface SimulationParameters {
    celestialBodyList: CelestialBody[];
    simulationMetaData: SimulationMetadata;
}

interface SimulationState {
    activeCelestialBodyName: string | null; // state is set on browser click
    simulationParameters: SimulationParameters | null;
    simulationData: SimulationData | null;
    timeControls: TimeControls | null;
}

// this is mandatory; passed to createSlice
const initialState: SimulationState = {
    activeCelestialBodyName: null,
    simulationParameters: null,
    simulationData: null,
    timeControls: {
        isPaused: true,
        progress: 0,
        speedMultiplier: 1
    }
};

export const simulationSlice = createSlice({
    name: 'simulation',
    initialState,
    reducers: {
        setActiveCelestialBodyName: (state, action: PayloadAction<string | null>) => {
            state.activeCelestialBodyName = action.payload; // redux toolkit creates a new state object, this
            // doesn't mutate it directly.
        },

        loadSimulation: (state, action: PayloadAction<SimulationParameters>) => {
            console.log("Payload received in reducer:", action.payload);
            state.simulationParameters = action.payload;
            console.log("Updated state in reducer:", state.simulationParameters);
        },

        updateDataReceived: (state, action: PayloadAction<SimulationData>) => {
            state.simulationData = action.payload;
            state.timeControls.isPaused = false;
            console.log("Simulation data updated:", state.simulationData);
        },
        togglePause: (state) => {
            state.timeControls.isPaused = !state.timeControls.isPaused;
        },
        setProgress: (state, action: PayloadAction<number>) => {
            state.timeControls.progress = action.payload;
        },
        setSpeedMultiplier: (state, action: PayloadAction<string>) => {
            console.log("payload: " + action.payload)
            let { speedMultiplier } = state.timeControls;
            let newMultiplier;
            if (action.payload === "increase") {
                if (speedMultiplier < -1) {
                    newMultiplier = speedMultiplier / 2
                } else if (speedMultiplier === -1) {
                    newMultiplier = 1;
                } else {
                    newMultiplier = speedMultiplier * 2
                }
            }
            else if (action.payload === "decrease") {
                if (speedMultiplier > 1) {
                    newMultiplier = speedMultiplier / 2
                } else if (speedMultiplier === 1) {
                    newMultiplier = -1
                } else {
                    newMultiplier = speedMultiplier * 2
                }
            }

            state.timeControls.speedMultiplier = Math.min(Math.max(newMultiplier, -128), 128);
            console.log("new speed: " + state.timeControls.speedMultiplier);
        }
    },
});

export const {
    setActiveCelestialBodyName,
    loadSimulation,
    updateDataReceived,
    togglePause,
    setProgress,
    setSpeedMultiplier
} = simulationSlice.actions;

export default simulationSlice.reducer;