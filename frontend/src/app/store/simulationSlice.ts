import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interfaces defining the structure of the JSON to be consumed
interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface CelestialBody {
    name: string;
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
    simulationMetadata: SimulationMetadata;
}

interface SimulationState {
    activeCelestialBodyName: string | null; // state is set on browser click
    simulationParameters: SimulationParameters | null;
    simulationData: SimulationData | null;
}

// this is mandatory; passed to createSlice
const initialState: SimulationState = {
    activeCelestialBodyName: null,
    simulationParameters: null,
    simulationData: null
};

export const simulationSlice = createSlice({
    name: 'simulation',
    initialState,
    reducers: {
        setActiveCelestialBodyName: (state, action: PayloadAction<string | null>) => {
            state.activeCelestialBodyName = action.payload; // redux toolkit creates a new state object, this
            // doesn't mutate it directly.
        },

        loadSimulationParameters: (state, action: PayloadAction<SimulationParameters>) => {
            console.log("Payload received in reducer:", action.payload);
            state.simulationParameters = action.payload;
            console.log("Updated state in reducer:", state.simulationParameters);
        },

        updateDataReceived: (state, action: PayloadAction<SimulationData>) => {
            state.simulationData = action.payload;
            console.log("Simulation data updated:", state.simulationData);
        },
    },
});

export const {
    setActiveCelestialBodyName,
    loadSimulationParameters,
    updateDataReceived,
} = simulationSlice.actions;

export default simulationSlice.reducer;