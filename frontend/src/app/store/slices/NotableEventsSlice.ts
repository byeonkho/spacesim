import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store/Store";
import type { DetectedEvent } from "@/app/utils/eventScanner";

// The full map of detected notable events plus the narration high-water mark.
// Events use GLOBAL timestep coordinates (eviction-invariant). The scrubber
// markers read this whole array; narration walks it as the playhead advances.

export interface SimEvent extends DetectedEvent {
  id: number;
}

interface NotableEventsState {
  detectedEvents: SimEvent[]; // sorted ascending by timeIndex
  narrationCursorGlobal: number; // events with timeIndex <= this have narrated
  nextId: number;
}

const initialState: NotableEventsState = {
  detectedEvents: [],
  narrationCursorGlobal: -1,
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
        state.detectedEvents.push({ ...e, id: state.nextId });
        state.nextId += 1;
      }
      // Drop anything that has slid out of the live window.
      state.detectedEvents = state.detectedEvents.filter(
        (e) => e.timeIndex >= bufferStartTimestep,
      );
      state.detectedEvents.sort((a, b) => a.timeIndex - b.timeIndex);
    },
    advanceNarrationCursor: (state, action: PayloadAction<number>) => {
      state.narrationCursorGlobal = Math.max(
        state.narrationCursorGlobal,
        action.payload,
      );
    },
    resetNotableEvents: (state) => {
      state.detectedEvents = [];
      state.narrationCursorGlobal = -1;
      state.nextId = 1;
    },
  },
});

export const { addDetectedEvents, advanceNarrationCursor, resetNotableEvents } =
  notableEventsSlice.actions;

export const selectDetectedEvents = (state: RootState): SimEvent[] =>
  state.notableEvents.detectedEvents;
export const selectNarrationCursorGlobal = (state: RootState): number =>
  state.notableEvents.narrationCursorGlobal;

// Events newly crossed since the cursor, up to and including the playhead.
export function eventsToNarrate(
  events: SimEvent[],
  cursorGlobal: number,
  playheadGlobal: number,
): SimEvent[] {
  if (playheadGlobal <= cursorGlobal) return [];
  return events.filter(
    (e) => e.timeIndex > cursorGlobal && e.timeIndex <= playheadGlobal,
  );
}

export default notableEventsSlice.reducer;
