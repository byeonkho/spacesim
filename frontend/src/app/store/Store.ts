import { configureStore } from '@reduxjs/toolkit';
import celestialBodyReducer from './CelestialBodySlice';

export const store = configureStore({
    reducer: {
        celestialBody: celestialBodyReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;