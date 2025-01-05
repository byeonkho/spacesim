import { configureStore } from '@reduxjs/toolkit';
import simulationSliceReducer, { simulationMiddleware } from './slices/SimulationSlice';
import webSocketReducer from './slices/WebSocketSlice';
import { webSocketMiddleware } from "@/app/store/middleware/webSocketMiddleware";

export const store = configureStore({
    reducer: {
        simulation: simulationSliceReducer,
        webSocket: webSocketReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable the SerializableStateInvariantMiddleware; high performance load due
            // to checking large state in slice every update
        }).concat(webSocketMiddleware, simulationMiddleware), // Add your custom middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
