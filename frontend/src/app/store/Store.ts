import { configureStore } from '@reduxjs/toolkit';
import simulationSliceReducer from './simulationSlice';
import webSocketReducer from './webSocketSlice';
import {webSocketMiddleware} from "@/app/store/middleware/webSocketMiddleware";

export const store = configureStore({
    reducer: {
        simulation: simulationSliceReducer,
        webSocket: webSocketReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(webSocketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;