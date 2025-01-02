import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Vector3} from "three";
import {RootState} from "@/app/store/Store";

interface TimeState {
    isPaused: boolean;
    progress: number; // percentage 0 - 100
    speedMultiplier: number;
    currentTimeStepIndex: number;
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
    timeState: TimeState | null;
}

// this is mandatory; passed to createSlice
const initialState: SimulationState = {
    activeCelestialBodyName: null,
    simulationParameters: null,
    simulationData: null,
    timeState: {
        isPaused: true,
        progress: 0,
        speedMultiplier: 1,
        currentTimeStepIndex: 0
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
            state.timeState.isPaused = false;
            console.log("Simulation data updated:", state.simulationData);
        },
        togglePause: (state) => {
            state.timeState.isPaused = !state.timeState.isPaused;
        },
        setProgress: (state, action: PayloadAction<number>) => {
            state.timeState.progress = action.payload;
        },
        setCurrentTimeStepIndex: (state, action: PayloadAction<number>) => {
            state.timeState.currentTimeStepIndex = action.payload;
        },
        setSpeedMultiplier: (state, action: PayloadAction<string>) => {
            console.log("payload: " + action.payload)
            let { speedMultiplier } = state.timeState;
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

            state.timeState.speedMultiplier = Math.min(Math.max(newMultiplier, -128), 128);
            console.log("new speed: " + state.timeState.speedMultiplier);
        }
    },
});

export const selectTimeStepKeys = createSelector(
    (state: RootState) => state.simulation.simulationData,
    (simulationData) => {
        if (!simulationData || !simulationData.data) {
            return [];
        }
        return Object.keys(simulationData.data).sort((a, b) => {
            const dateA = new Date(a.split(": ")[1]).getTime();
            const dateB = new Date(b.split(": ")[1]).getTime();
            return dateA - dateB; // Sort ascending by timestamp
        });
    }
);

export const selectSessionID = (state: RootState) =>
    state.simulation.simulationParameters?.simulationMetaData?.sessionID;

export const selectTotalTimeSteps = (state: RootState) =>
    state.simulation.simulationData ? Object.keys(state.simulation.simulationData).length : 0;


export const {
    setActiveCelestialBodyName,
    loadSimulation,
    updateDataReceived,
    togglePause,
    setProgress,
    setSpeedMultiplier,
    setCurrentTimeStepIndex
} = simulationSlice.actions;

export default simulationSlice.reducer;