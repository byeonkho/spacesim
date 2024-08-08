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
    celestialBodyList: CelestialBody[];
    sessionID: string;
    metadataList: CelestialBodyMetadata[];
}


interface SimulationState {
    activeCelestialBodyName: string | null; // state is set on browser click
    simulationData: SimulationData | null; // the concrete state built from the JSON
}

const initialState: SimulationState = {
    activeCelestialBodyName: null,
    simulationData: null
};

export const simulationSlice = createSlice({
    name: 'simulation',
    initialState,
    reducers: {
        setActiveCelestialBodyName: (state, action: PayloadAction<string | null>) => {
            state.activeCelestialBodyName = action.payload;
        },
        loadSimulationData: (state, action: PayloadAction<SimulationData>) => {
            state.simulationData = action.payload;
        },
    },
});

export const {
    setActiveCelestialBodyName,
    loadSimulationData,
} = simulationSlice.actions;

export default simulationSlice.reducer;