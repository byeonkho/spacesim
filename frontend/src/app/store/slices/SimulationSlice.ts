import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Vector3} from "three";
import {RootState} from "@/app/store/Store";
import {requestRunSimulation} from "@/app/store/middleware/webSocketMiddleware";

const MAX_TIMESTEPS = 30_000;
const TIMESTEP_CHUNK_SIZE = 10_000;
const MAX_SPEED_MULTIPLIER = 128; // exponent of 2

interface TimeState {
    isPaused: boolean;
    isUpdating: boolean;
    progress: number; // percentage 0 - 100
    speedMultiplier: number;
    currentTimeStepIndex: number;
    currentTimeStepKey: string;
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
    activeCelestialBodyName: string | null;
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
        isUpdating: false,
        progress: 0,
        speedMultiplier: 1,
        currentTimeStepIndex: 0,
        currentTimeStepKey: ""
    }
};

export const simulationSlice = createSlice({
    name: 'simulation',
    initialState,
    reducers: {
        setActiveCelestialBodyName: (state, action: PayloadAction<string | null>) => {
            state.activeCelestialBodyName = action.payload;
        },

        loadSimulation: (state, action: PayloadAction<SimulationParameters>) => {
            state.simulationParameters = action.payload;
        },

        updateDataReceived: (state, action: PayloadAction<{ data: SimulationData }>) => {
            if (!state.simulationData) {
                state.simulationData = action.payload.data;
            } else {
                const updatedData = {...state.simulationData, ...action.payload.data};
                const timeStepKeys = Object.keys(updatedData)
                if (timeStepKeys.length > MAX_TIMESTEPS) {
                    const excessCount = TIMESTEP_CHUNK_SIZE;

                    // Remove the earliest indices
                    timeStepKeys.splice(0, excessCount).forEach((key) => {
                        console.log("DELETING EXCESS: ", excessCount)
                        delete updatedData[key];
                    });

                    // don't use the reducer here; gets intercepted by middleware used by Scene rendering
                    state.timeState.currentTimeStepIndex = (Math.max(0, state.timeState.currentTimeStepIndex - excessCount))
                }
                state.simulationData = updatedData;
                console.log("Simulation data updated:", state.simulationData);
            }
            // unlock rendering loop
            state.timeState.isUpdating = false;
            state.timeState.isPaused = false;
        },
        togglePause: (state) => {
            state.timeState.isPaused = !state.timeState.isPaused;
        },
        setIsUpdating: (state, action: PayloadAction<boolean>) => {
            state.timeState.isUpdating = action.payload;
        },
        setIsPaused: (state, action: PayloadAction<boolean>) => {
            state.timeState.isPaused = action.payload;
        },

        setProgress: (state, action: PayloadAction<number>) => {
            state.timeState.progress = action.payload;
        },
        setCurrentTimeStepIndex: (state, action: PayloadAction<number>) => {
            state.timeState.currentTimeStepIndex = action.payload;
        },
        setCurrentTimeStepKey: (state, action: PayloadAction<number>) => {
            state.timeState.currentTimeStepKey = action.payload;
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
            state.timeState.speedMultiplier = Math.min(Math.max(newMultiplier, -MAX_SPEED_MULTIPLIER), MAX_SPEED_MULTIPLIER);
        }
    },
});

///////////////////////////////////////////// MIDDLEWARE /////////////////////////////////////////////

export const simulationMiddleware = store => next => action => {

    // intercepts the rendering loop; runs logic to get new data batch if < n iterations left
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

        if (remainingIndexes <= 9000 && !state.webSocket.isRequestInProgress) {
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
        return Object.keys(simulationData)
    }
);

export const selectSimulationDataSize = createSelector(
    (state: RootState) => state.simulation.simulationData,
    (simulationData) => {
        if (!simulationData) return 0;
        const jsonString = JSON.stringify(simulationData);
        return new Blob([jsonString]).size; // Size in bytes
    }
);

export const selectCurrentTimeStepIndex = (state: RootState) => state.simulation.timeState.currentTimeStepIndex;

export const selectCurrentTimeStepKey = (state: RootState) => state.simulation.timeState.currentTimeStepKey;

export const selectIsUpdating = (state: RootState) => state.simulation.timeState.isUpdating;

export const selectSessionID = (state: RootState) =>
    state.simulation.simulationParameters?.simulationMetaData?.sessionID;

export const selectTotalTimeSteps = (state: RootState) =>
    state.simulation.simulationData ? Object.keys(state.simulation.simulationData).length : 0;


export const {
    setActiveCelestialBodyName,
    loadSimulation,
    updateDataReceived,
    togglePause,
    setIsUpdating,
    setCurrentTimeStepKey,
    setIsPaused,
    setProgress,
    setSpeedMultiplier,
    setCurrentTimeStepIndex

} = simulationSlice.actions;

export default simulationSlice.reducer;