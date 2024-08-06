import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CelestialBody {
    id: string;
    radius: number;
    color: string;
    // Add other properties as needed
}

interface RotationPayload {
    id: string;
    axis: 'x' | 'y' | 'z';
    value: number;
}

interface SimulationState {
    activeCelestialBodyId: string | null;
    bodies: CelestialBody[];
}

const initialState: SimulationState = {
    activeCelestialBodyId: null,
    bodies: [],
};

export const celestialBodySlice = createSlice({
    name: 'celestialBody',
    initialState,
    reducers: {
        setActiveCelestialBodyId: (state, action: PayloadAction<string | null>) => {
            state.activeCelestialBodyId = action.payload;
        },

        addCelestialBody: (state, action: PayloadAction<CelestialBody>) => {
            state.bodies.push(action.payload);
        },

        updateRotation: (state, action: PayloadAction<RotationPayload>) => {
            const {id, axis, value} = action.payload;
            const body = state.bodies.find(body => body.id === id);
            if (body) {
                body.rotation[axis] = value;
            }
        }
    },
});

export const {
    setActiveCelestialBodyId,
    addCelestialBody,
    updateRotation
} = celestialBodySlice.actions;

export default celestialBodySlice.reducer;