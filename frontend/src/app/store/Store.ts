import { configureStore } from "@reduxjs/toolkit";
import simulationSliceReducer, {
  simulationUpdateDataMiddleware,
} from "./slices/SimulationSlice";
import requestReducer from "./slices/RequestSlice";
import eventLogReducer from "./slices/EventLogSlice";
import groundTruthReducer from "./slices/GroundTruthSlice";
import uiReducer from "./slices/UISlice";
import tourReducer from "./slices/TourSlice";
import notableEventsReducer from "./slices/NotableEventsSlice";
import { groundTruthMiddleware } from "./middleware/groundTruthMiddleware";
import { userActionLogger } from "./middleware/userActionLogger";
import { tourMiddleware } from "./middleware/tourMiddleware";
import { notableEventsMiddleware } from "./middleware/notableEventsMiddleware";

export const store = configureStore({
  reducer: {
    simulation: simulationSliceReducer,
    request: requestReducer,
    eventLog: eventLogReducer,
    groundTruth: groundTruthReducer,
    ui: uiReducer,
    tour: tourReducer,
    notableEvents: notableEventsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(simulationUpdateDataMiddleware)
      .concat(groundTruthMiddleware)
      .concat(userActionLogger)
      .concat(tourMiddleware)
      .concat(notableEventsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
