import {configureStore} from '@reduxjs/toolkit';
import simulationSliceReducer, {simulationMiddleware} from './slices/SimulationSlice';
import webSocketReducer from './slices/WebSocketSlice';
import {webSocketMiddleware} from "@/app/store/middleware/webSocketMiddleware";

export const store = configureStore({
    reducer: {
        simulation: simulationSliceReducer,
        webSocket: webSocketReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(webSocketMiddleware, simulationMiddleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;