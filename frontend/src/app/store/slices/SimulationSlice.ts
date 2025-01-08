import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Vector3} from "three";
import {RootState} from "@/app/store/Store";
import {requestRunSimulation} from "@/app/store/middleware/webSocketMiddleware";
import SimConstants from "@/app/constants/SimConstants";

interface TimeState {
    isPaused: boolean;
    isUpdating: boolean;
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
    currentSnapshot: [];
    activeCelestialBodyName: string | null;
    simulationParameters: SimulationParameters | null;
    simulationData: SimulationData | null;
    timeState: TimeState | null;
}

// this is mandatory; passed to createSlice
    const initialState: SimulationState = {
        currentSnapshot: [],
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
                state.simulationData = {...state.simulationData, ...action.payload.data};
                console.log("Simulation data updated:", state.simulationData);
            }
            // unlock rendering loop
            state.timeState.isUpdating = false;
            state.timeState.isPaused = false;
        },
        deleteExcessData: (state, action: PayloadAction<{ excessCount: number, timeStepKeys: string[] }>) => {
            const { excessCount, timeStepKeys } = action.payload;

                // Remove the earliest indices
                const keysToRemove = timeStepKeys.slice(0, excessCount);
                keysToRemove.forEach((key) => {
                    delete state.simulationData[key]; // Remove from the state
                });

                // Adjust currentTimeStepIndex
                state.timeState.currentTimeStepIndex = Math.max(
                    0,
                    state.timeState.currentTimeStepIndex - excessCount
                );
        },
        togglePause: (state) => {
            state.timeState.isPaused = !state.timeState.isPaused;
        },
        setCurrentSnapshot: (state, action: PayloadAction<CelestialBody[]>) => {
            state.currentSnapshot = Array.isArray(action.payload) ? action.payload : [];
        },
        setIsUpdating: (state, action: PayloadAction<boolean>) => {
            state.timeState.isUpdating = action.payload;
        },
        setIsPaused: (state, action: PayloadAction<boolean>) => {
            state.timeState.isPaused = action.payload;
        },

        setCurrentTimeStepIndex: (state, action: PayloadAction<number>) => {
            state.timeState.currentTimeStepIndex = action.payload;
        },
        setCurrentTimeStepKey: (state, action: PayloadAction<number>) => {
            state.timeState.currentTimeStepKey = action.payload;
        },
        setSpeedMultiplier: (state, action: PayloadAction<string>) => {
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
            state.timeState.speedMultiplier = Math.min(Math.max(newMultiplier, -SimConstants.MAX_SPEED_MULTIPLIER), SimConstants.MAX_SPEED_MULTIPLIER);
        }
    },
});

///////////////////////////////////////////// MIDDLEWARE /////////////////////////////////////////////

// intercepts the rendering loop as 1st step; runs logic to get new data batch if < n iterations left
export const simulationUpdateDataMiddleware = store => next => action => {
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

// intercepts rendering loop as 2nd step; derives and sets current simulationSnapshot
export const simulationSetSnapshotMiddleware = store => next => action => {

    if (action.type === 'simulation/setCurrentTimeStepIndex') {
        const state = store.getState();
        const simulationData = state.simulation.simulationData;
        if (!simulationData) {
            console.warn("simulationData is not available yet.");
            return next(action);
        }
        const currentTimeStepIndex = action.payload;
        const timeStepKeys = selectTimeStepKeys(state)
        const currentTimeStepKey = timeStepKeys[currentTimeStepIndex];
        const currentSnapshot = currentTimeStepKey && simulationData[currentTimeStepKey] ? simulationData[currentTimeStepKey] : [];
        store.dispatch(setCurrentSnapshot(currentSnapshot))
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
    deleteExcessData,
    setCurrentSnapshot,
    setIsUpdating,
    setCurrentTimeStepKey,
    setIsPaused,
    setSpeedMultiplier,
    setCurrentTimeStepIndex

} = simulationSlice.actions;

export default simulationSlice.reducer;