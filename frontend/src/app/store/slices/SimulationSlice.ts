import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/store/Store";
import { requestRunSimulation } from "@/app/store/middleware/webSocketMiddleware";
import SimConstants, {
  BodyProperties,
  bodyProperties,
} from "@/app/constants/SimConstants";
import { StaticImageData } from "next/image";

interface TimeState {
  isPaused: boolean;
  isUpdating: boolean;
  speedMultiplier: number;
  currentTimeStepIndex: number;
  currentTimeStepKey: string;
}

export interface Vector3Simple {
  x: number;
  y: number;
  z: number;
}

export interface CelestialBody {
  name: string;
  position: Vector3Simple;
  velocity: Vector3Simple;
}

export interface CelestialBodyProperties {
  mass?: number;
  radius?: number;
  name?: string;
  orbitingBody?: string;
  positionScale?: number;
  texture?: StaticImageData;
}

interface SimulationMetadata {
  sessionID: string;
}

interface ActiveBodyState {
  isBodyActive: boolean;
  activeBody: CelestialBody | null;
}

export interface SimulationData {
  [date: string]: CelestialBody[];
}

export interface SimulationScale {
  // set in SimConstants
  name: string;
  positionScale: number;
  radiusScale: number;
  EXCEPTION_BODIES_POSITION_SCALE: { [bodyName: string]: number };
  GRID: {
    SIZE: number;
    SEGMENTS: number;
  };
  AXES: {
    SIZE: number;
  };
}

export interface SimulationParameters {
  celestialBodyPropertiesList: CelestialBodyProperties[] | null;
  simulationMetaData: SimulationMetadata | null;
  showGrid: boolean;
  showAxes: boolean;
  showPlanetInfoOverlay: boolean;
  simulationScale: SimulationScale;
}

interface SimulationState {
  currentSimulationSnapshot: CelestialBody[];
  activeBodyState: ActiveBodyState;
  simulationParameters: SimulationParameters | null;
  simulationData: SimulationData | null;
  timeState: TimeState | null;
}

// this is mandatory; passed to createSlice
const initialState: SimulationState = {
  currentSimulationSnapshot: [],
  activeBodyState: {
    isBodyActive: false,
    activeBody: null,
  },
  simulationParameters: {
    celestialBodyPropertiesList: [],
    simulationMetaData: null,
    showGrid: false,
    showAxes: false,
    showPlanetInfoOverlay: false,
    simulationScale: SimConstants.SCALE.SEMI_REALISTIC, // default scale
  },
  simulationData: null,
  timeState: {
    isPaused: true,
    isUpdating: false,
    progress: 0,
    speedMultiplier: 1,
    currentTimeStepIndex: 0,
    currentTimeStepKey: "",
  },
};

export const simulationSlice = createSlice({
  name: "simulation",
  initialState,
  reducers: {
    loadSimulation: (state, action: PayloadAction<SimulationParameters>) => {
      state.simulationParameters = {
        ...state.simulationParameters,
        ...action.payload,
      };

      if (
        state.simulationParameters &&
        state.simulationParameters.celestialBodyPropertiesList
      ) {
        const exceptionMap =
          state.simulationParameters.simulationScale
            ?.EXCEPTION_BODIES_POSITION_SCALE || {};

        state.simulationParameters.celestialBodyPropertiesList =
          state.simulationParameters.celestialBodyPropertiesList.map(
            (body: CelestialBodyProperties): CelestialBodyProperties => {
              if (body.name) {
                const upperName = body.name.trim().toUpperCase();
                // Determine the new positionScale: if there's an exception, use it; otherwise, default to 1.
                const newPositionScale =
                  exceptionMap[upperName] !== undefined
                    ? exceptionMap[upperName]
                    : 1;
                // look up default constants (e.g textures)
                const defaults: BodyProperties = bodyProperties[upperName];
                // Merge defaults into the body properties.
                return {
                  ...body,
                  ...defaults,
                  positionScale: newPositionScale,
                };
              }
              return { ...body, positionScale: 1 };
            },
          );
      }
      console.log(
        "load sim: ",
        state.simulationParameters.celestialBodyPropertiesList,
        "scale:",
        state.simulationParameters.simulationScale,
      );
    },

    updateDataReceived: (
      state,
      action: PayloadAction<{ data: SimulationData }>,
    ) => {
      if (!state.simulationData) {
        state.simulationData = action.payload.data;
      } else {
        state.simulationData = {
          ...state.simulationData,
          ...action.payload.data,
        };
        console.log("Simulation data updated:", state.simulationData);
      }
      // unlock rendering loop
      state.timeState.isUpdating = false;
      state.timeState.isPaused = false;
    },
    deleteExcessData: (
      state,
      action: PayloadAction<{ excessCount: number; timeStepKeys: string[] }>,
    ) => {
      const { excessCount, timeStepKeys } = action.payload;

      // Remove the earliest indices
      const keysToRemove = timeStepKeys.slice(0, excessCount);
      keysToRemove.forEach((key) => {
        delete state.simulationData[key]; // Remove from the state
      });

      // Adjust currentTimeStepIndex
      state.timeState.currentTimeStepIndex = Math.max(
        0,
        state.timeState.currentTimeStepIndex - excessCount,
      );
    },
    togglePause: (state) => {
      state.timeState.isPaused = !state.timeState.isPaused;
    },
    toggleShowGrid: (state) => {
      if (state.simulationData) {
        state.simulationParameters.showGrid =
          !state.simulationParameters.showGrid;
      }
    },
    toggleShowAxes: (state) => {
      if (state.simulationData) {
        state.simulationParameters.showAxes =
          !state.simulationParameters.showAxes;
      }
    },
    toggleShowPlanetInfoOverlay: (state) => {
      if (state.simulationData) {
        state.simulationParameters.showPlanetInfoOverlay =
          !state.simulationParameters.showPlanetInfoOverlay;
      }
    },

    setCurrentSimulationSnapshot: (
      state,
      action: PayloadAction<CelestialBody[]>,
    ) => {
      state.currentSimulationSnapshot = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    setIsUpdating: (state, action: PayloadAction<boolean>) => {
      state.timeState.isUpdating = action.payload;
    },
    setIsPaused: (state, action: PayloadAction<boolean>) => {
      state.timeState.isPaused = action.payload;
    },

    setCurrentTimeStepIndex: (state, action: PayloadAction<number>) => {
      state.timeState.currentTimeStepIndex = action.payload;
    },
    setCurrentTimeStepKey: (state, action: PayloadAction<number>) => {
      state.timeState.currentTimeStepKey = action.payload;
    },
    setSpeedMultiplier: (state, action: PayloadAction<string>) => {
      let { speedMultiplier } = state.timeState;
      let newMultiplier;
      if (action.payload === "increase") {
        if (speedMultiplier < -1) {
          newMultiplier = speedMultiplier / 2;
        } else if (speedMultiplier === -1) {
          newMultiplier = 1;
        } else {
          newMultiplier = speedMultiplier * 2;
        }
      } else if (action.payload === "decrease") {
        if (speedMultiplier > 1) {
          newMultiplier = speedMultiplier / 2;
        } else if (speedMultiplier === 1) {
          newMultiplier = -1;
        } else {
          newMultiplier = speedMultiplier * 2;
        }
      }
      state.timeState.speedMultiplier = Math.min(
        Math.max(newMultiplier, -SimConstants.MAX_SPEED_MULTIPLIER),
        SimConstants.MAX_SPEED_MULTIPLIER,
      );
    },
    updateActiveBody: (state: SimulationState): void => {
      if (!state.activeBodyState || !state.activeBodyState.activeBody) return;
      const activeBodyName: string = state.activeBodyState.activeBody.name;
      state.activeBodyState.activeBody =
        state.currentSimulationSnapshot.find(
          (body: CelestialBody) => body.name === activeBodyName,
        ) || null;
    },

    setActiveBody: (
      state: SimulationState,
      action: PayloadAction<CelestialBody>,
    ) => {
      state.activeBodyState.activeBody = action.payload;
      state.activeBodyState.isBodyActive = true;
    },
    setIsBodyActive: (
      state: SimulationState,
      action: PayloadAction<boolean>,
    ) => {
      console.log("payload: ", action.payload);
      state.activeBodyState.isBodyActive = action.payload;
    },
    cycleSimulationScale: (state) => {
      if (state.simulationParameters.simulationScale && state.simulationData) {
        const currentScale = state.simulationParameters.simulationScale;
        const scaleOptions: string[] = Object.keys(SimConstants.SCALE); //ES6 objects have defined insertion order
        // for string keys

        const currentIndex = scaleOptions.findIndex((key) => {
          const preset = SimConstants.SCALE[key];
          return (
            preset.positionScale === currentScale.positionScale &&
            preset.radiusScale === currentScale.radiusScale
          );
        });

        const nextIndex: number = (currentIndex + 1) % scaleOptions.length;
        const nextKey: string = scaleOptions[nextIndex];

        state.simulationParameters.simulationScale =
          SimConstants.SCALE[nextKey];

        const exceptions =
          state.simulationParameters.simulationScale
            .EXCEPTION_BODIES_POSITION_SCALE;

        // for exceptions (e.g Moon), map the custom position scale from SimConstants. we need to tweak the position
        // scale here because otherwise we end up with cases like the moon being rendered in the earth, since the
        // radius-position ratio is not aligned
        if (
          exceptions &&
          state.simulationParameters.celestialBodyPropertiesList
        ) {
          state.simulationParameters.celestialBodyPropertiesList =
            state.simulationParameters.celestialBodyPropertiesList.map(
              (bodyProps) => {
                if (
                  bodyProps.name &&
                  exceptions[bodyProps.name.toUpperCase()] !== undefined
                ) {
                  return {
                    ...bodyProps,
                    positionScale: exceptions[bodyProps.name.toUpperCase()],
                  };
                }
                return bodyProps;
              },
            );
        }
      }
    },
  },
});

///////////////////////////////////////////// MIDDLEWARE /////////////////////////////////////////////

// intercepts the rendering loop as 1st step; runs logic to get new data batch if < n iterations left
export const simulationUpdateDataMiddleware = (store) => (next) => (action) => {
  if (action.type === "simulation/setCurrentTimeStepIndex") {
    const state = store.getState();

    const simulationData = state.simulation.simulationData;
    if (!simulationData) {
      console.warn("simulationData is not available yet.");
      return next(action);
    }

    const totalTimeSteps = selectTotalTimeSteps(state);
    const currentTimeStepIndex = action.payload;
    const remainingIndexes = totalTimeSteps - currentTimeStepIndex;

    if (remainingIndexes <= 9000 && !state.webSocket.isRequestInProgress) {
      const sessionID = selectSessionID(state);
      if (!sessionID) {
        console.warn("Session ID is not defined. Cannot send request.");
        return next(action);
      }

      const requestData = { sessionID };
      store.dispatch(requestRunSimulation(requestData));
    }
  }
  return next(action);
};

// intercepts rendering loop as 2nd step; derives and sets current simulationSnapshot
export const simulationSetSnapshotMiddleware =
  (store) => (next) => (action) => {
    if (action.type === "simulation/setCurrentTimeStepIndex") {
      const state = store.getState();
      const simulationData = state.simulation.simulationData;
      if (!simulationData) {
        console.warn("simulationData is not available yet.");
        return next(action);
      }
      const currentTimeStepIndex: number = action.payload;
      const timeStepKeys = selectTimeStepKeys(state);
      const currentTimeStepKey = timeStepKeys[currentTimeStepIndex];
      store.dispatch(setCurrentTimeStepKey(currentTimeStepKey));
      const currentSnapshot =
        currentTimeStepKey && simulationData[currentTimeStepKey]
          ? simulationData[currentTimeStepKey]
          : [];
      store.dispatch(setCurrentSimulationSnapshot(currentSnapshot));
    }
    return next(action);
  };

///////////////////////////////////////////// SELECTORS /////////////////////////////////////////////
export const selectTimeStepKeys = createSelector(
  (state: RootState) => state.simulation.simulationData,
  (simulationData: SimulationData) => {
    if (!simulationData) {
      return [];
    }
    return Object.keys(simulationData);
  },
);

export const selectSimulationDataSize = createSelector(
  (state: RootState) => state.simulation.simulationData,
  (simulationData: SimulationData): number => {
    if (!simulationData) return 0;
    const jsonString = JSON.stringify(simulationData);
    return new Blob([jsonString]).size; // Size in bytes
  },
);

// get the body that the input body is orbiting (e.g input Moon -> returns Earth)
export const selectDerivedOrbitingBody = createSelector(
  [
    (state: RootState) =>
      state.simulation.simulationParameters?.CelestialBodyPropertiesList,
    (state: RootState) => state.simulation.currentSimulationSnapshot,
    (state: RootState, props: { bodyName: string }) => props.bodyName,
  ],
  (
    CelestialBodyPropertiesList: CelestialBodyProperties[],
    currentSimulationSnapshot: CelestialBody[],
    bodyName: string,
  ): CelestialBody | undefined => {
    if (!CelestialBodyPropertiesList) return undefined;
    // Find the celestial body wrapper that matches the provided bodyName.
    const CelestialBodyProperties: CelestialBodyProperties | undefined =
      CelestialBodyPropertiesList.find(
        (cb: CelestialBodyProperties): boolean =>
          cb.name?.trim().toLowerCase() === bodyName.trim().toLowerCase(),
      );
    if (!CelestialBodyProperties) return undefined;

    const orbitingBodyName: string | undefined =
      CelestialBodyProperties.orbitingBody;

    return currentSimulationSnapshot.find(
      (body: CelestialBody): boolean =>
        body.name.trim().toLowerCase() ===
        orbitingBodyName?.trim().toLowerCase(),
    );
  },
);

export const selectTotalTimeSteps = createSelector(
  (state: RootState) => state.simulation.simulationData,
  (simulationData: SimulationData): number =>
    simulationData ? Object.keys(simulationData).length : 0,
);

export const selectBodyRadiusFromName = createSelector(
  [
    (state: RootState) =>
      state.simulation.simulationParameters.CelestialBodyPropertiesList,
    (state: RootState, props: { bodyName: string }) => props.bodyName,
  ],
  (
    CelestialBodyPropertiesList: CelestialBodyProperties[],
    bodyName: string,
  ): number | undefined => {
    if (!CelestialBodyPropertiesList) return undefined;
    const CelestialBodyProperties: CelestialBodyProperties | undefined =
      CelestialBodyPropertiesList.find(
        (cb: CelestialBodyProperties): boolean =>
          cb.name?.trim().toLowerCase() === bodyName.trim().toLowerCase(),
      );
    return CelestialBodyProperties?.radius;
  },
);

export const selectShowGrid = (state: RootState) =>
  state.simulation.simulationParameters.showGrid;

export const selectShowAxes = (state: RootState) =>
  state.simulation.simulationParameters.showAxes;

export const selectShowPlanetInfoOverlay = (state: RootState) =>
  state.simulation.simulationParameters.showPlanetInfoOverlay;

export const selectSimulationScale = (state: RootState) =>
  state.simulation.simulationParameters.simulationScale;

export const selectActiveBody = (state: RootState) =>
  state.simulation.activeBodyState.activeBody;

export const selectIsBodyActive = (state: RootState) =>
  state.simulation.activeBodyState.isBodyActive;

export const selectCurrentTimeStepIndex = (state: RootState) =>
  state.simulation.timeState.currentTimeStepIndex;

export const selectCelestialBodyPropertiesList = (state: RootState) =>
  state.simulation.simulationParameters?.celestialBodyPropertiesList;

export const selectIsPaused = (state: RootState) =>
  state.simulation.timeState.isPaused;

export const selectSpeedMultiplier = (state: RootState) =>
  state.simulation.timeState.speedMultiplier;

export const selectCurrentTimeStepKey = (state: RootState) =>
  state.simulation.timeState.currentTimeStepKey;

export const selectIsUpdating = (state: RootState) =>
  state.simulation.timeState.isUpdating;

export const selectSessionID = (state: RootState) =>
  state.simulation.simulationParameters?.simulationMetaData?.sessionID;

export const selectCurrentSimulationSnapshot = (state: RootState) =>
  state.simulation.currentSimulationSnapshot;

export const {
  updateActiveBody,
  loadSimulation,
  updateDataReceived,
  togglePause,
  toggleShowGrid,
  toggleShowAxes,
  toggleShowPlanetInfoOverlay,
  deleteExcessData,
  setCurrentSimulationSnapshot,
  setIsUpdating,
  setCurrentTimeStepKey,
  setIsPaused,
  cycleSimulationScale,
  setSpeedMultiplier,
  setCurrentTimeStepIndex,
  setActiveBody,
  setIsBodyActive,
} = simulationSlice.actions;

export default simulationSlice.reducer;
