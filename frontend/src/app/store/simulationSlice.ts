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

interface CelestialBodyMetadata {
    name: string;
    mass: number;
    radius: number;
}

export interface SimulationData {
    [date: string]: CelestialBody[];
}

export interface SimulationParameters {
    celestialBodyList: CelestialBody[];
    sessionID: string;
    metadataList: CelestialBodyMetadata[];
}

interface SimulationState {
    activeCelestialBodyName: string | null; // state is set on browser click
    simulationParameters: SimulationParameters | null; // the concrete state built from the JSON
}

const initialState: SimulationState = {
    activeCelestialBodyName: null,
    simulationParameters: null
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
            state.simulationParameters = action.payload;
        },

        //TODO better name for this pls
        updateDataReceived: (state, action: PayloadAction<SimulationData>) => {
            state.simulationComputedData = action.payload;
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