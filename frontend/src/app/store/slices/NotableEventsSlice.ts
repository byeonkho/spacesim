import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store/Store";
import type { DetectedEvent } from "@/app/utils/eventScanner";

// The full map of detected notable events plus per-event narration state.
// Events use GLOBAL timestep coordinates (eviction-invariant). The scrubber
// markers read this whole array; narration marks each eligible event once.

export interface SimEvent extends DetectedEvent {
  id: number;
  narrated: boolean;
}

interface NotableEventsState {
  detectedEvents: SimEvent[]; // sorted ascending by timeIndex
  nextId: number;
}

const initialState: NotableEventsState = {
  detectedEvents: [],
  nextId: 1,
};

export const notableEventsSlice = createSlice({
  name: "notableEvents",
  initialState,
  reducers: {
    addDetectedEvents: (
      state,
      action: PayloadAction<{
        events: DetectedEvent[];
        bufferStartTimestep: number;
      }>,
    ) => {
      const { events, bufferStartTimestep } = action.payload;
      for (const e of events) {
        state.detectedEvents.push({
          ...e,
          id: state.nextId,
          narrated: false,
        });
        state.nextId += 1;
      }
      // Drop anything that has slid out of the live window.
      state.detectedEvents = state.detectedEvents.filter(
        (e) => e.timeIndex >= bufferStartTimestep,
      );
      state.detectedEvents.sort((a, b) => a.timeIndex - b.timeIndex);
    },
    markEventsNarrated: (state, action: PayloadAction<number[]>) => {
      for (const event of state.detectedEvents) {
        if (action.payload.includes(event.id)) {
          event.narrated = true;
        }
      }
    },
    resetNotableEvents: (state) => {
      state.detectedEvents = [];
      state.nextId = 1;
    },
  },
});

export const { addDetectedEvents, markEventsNarrated, resetNotableEvents } =
  notableEventsSlice.actions;

export const selectDetectedEvents = (state: RootState): SimEvent[] =>
  state.notableEvents.detectedEvents;

export function eventsToNarrate(
  events: SimEvent[],
  playheadGlobal: number,
): SimEvent[] {
  return events.filter(
    (event) => !event.narrated && event.timeIndex <= playheadGlobal,
  );
}

export default notableEventsSlice.reducer;
