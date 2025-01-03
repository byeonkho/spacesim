import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Vector3} from "three";
import {RootState} from "@/app/store/Store";
import {requestRunSimulation} from "@/app/store/middleware/webSocketMiddleware";

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

        updateDataReceived: (state, action: PayloadAction<{ data: SimulationData }>) => {
            if (!state.simulationData) {
                state.simulationData = action.payload.data;
            } else {
                state.simulationData = {
                    ...state.simulationData,
                    ...action.payload.data,
                };
            }
            if (state.timeState.isPaused) {
                state.timeState.isPaused = false;
            }
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

///////////////////////////////////////////// MIDDLEWARE /////////////////////////////////////////////
export const simulationMiddleware = store => next => action => {
    if (action.type === 'simulation/setCurrentTimeStepIndex') {
        const state = store.getState();

        const simulationData = state.simulation.simulationData;
        if (!simulationData) {
            console.warn("simulationData is not available yet.");
            return next(action);
        }

        const totalTimeSteps = selectTotalTimeSteps(state);
        const currentTimeStepIndex = action.payload;
        const remainingIndexes = totalTimeSteps - currentTimeStepIndex;

        console.log("Simulation Data:", simulationData);
        console.log("Total Time Steps:", totalTimeSteps);
        console.log("Current Time Step Index:", currentTimeStepIndex);
        console.log("Remaining Indexes:", remainingIndexes);

        if (remainingIndexes <= 9000 && !state.webSocket.isRequestInProgress) {

            console.log("DEBUG TRIGGERING DISPATCH")// Trigger when remaining indexes fall below 5000
            const sessionID = selectSessionID(state);
            if (!sessionID) {
                console.warn("Session ID is not defined. Cannot send request.");
                return next(action);
            }

            const requestData = { sessionID };
            store.dispatch(requestRunSimulation(requestData));
        }
    }

    return next(action);
};


///////////////////////////////////////////// SELECTORS /////////////////////////////////////////////
export const selectTimeStepKeys = createSelector(
    (state: RootState) => state.simulation.simulationData,
    (simulationData) => {
        if (!simulationData) {
            return [];
        }
        return Object.keys(simulationData).sort((a, b) => {
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