import { configureStore } from "@reduxjs/toolkit";
import simulationSliceReducer, {
  simulationSetSnapshotMiddleware,
  simulationUpdateDataMiddleware,
} from "./slices/SimulationSlice";
import webSocketReducer from "./slices/WebSocketSlice";
import { webSocketMiddleware } from "@/app/store/middleware/webSocketMiddleware";

export const store = configureStore({
  reducer: {
    simulation: simulationSliceReducer,
    webSocket: webSocketReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disable SerializableStateInvariantMiddleware; high performance load due
      // to checking large state in slice every update in dev mode
    }).concat(
      webSocketMiddleware,
      simulationUpdateDataMiddleware,
      simulationSetSnapshotMiddleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
