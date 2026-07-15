import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store/Store";

// USR entries come from userActionLogger. SIM entries come from
// notableEventsMiddleware as playback crosses detected events. History is
// capped at MAX_EVENTS so the panel remains bounded and responsive.

export type EventSource = "USR" | "SIM";
export type EventSeverity = "info" | "user" | "warn";

export interface LogEvent {
  id: number;
  ts: number;
  source: EventSource;
  severity: EventSeverity;
  message: string;
  // Present only on SIM entries: the GLOBAL timestep index the event sits at,
  // so clicking the row can seek the scrubber there.
  timeIndex?: number;
}

export type EventFilter = "ALL" | EventSource;

interface EventLogState {
  events: LogEvent[];
  filter: EventFilter;
  nextId: number;
}

const MAX_EVENTS = 200;

const initialState: EventLogState = {
  events: [],
  filter: "ALL",
  nextId: 1,
};

export const eventLogSlice = createSlice({
  name: "eventLog",
  initialState,
  reducers: {
    pushEvent: (
      state,
      action: PayloadAction<
        Omit<LogEvent, "id" | "ts"> & { ts?: number }
      >,
    ) => {
      const event: LogEvent = {
        id: state.nextId,
        ts: action.payload.ts ?? Date.now(),
        source: action.payload.source,
        severity: action.payload.severity,
        message: action.payload.message,
        timeIndex: action.payload.timeIndex,
      };
      state.nextId += 1;
      state.events.unshift(event);
      if (state.events.length > MAX_EVENTS) {
        state.events.length = MAX_EVENTS;
      }
    },
    setEventFilter: (state, action: PayloadAction<EventFilter>) => {
      state.filter = action.payload;
    },
    clearEvents: (state) => {
      state.events = [];
    },
  },
});

export const { pushEvent, setEventFilter, clearEvents } =
  eventLogSlice.actions;

export const selectEvents = (state: RootState) => state.eventLog.events;
export const selectEventFilter = (state: RootState) => state.eventLog.filter;

export const selectFilteredEvents = createSelector(
  [selectEvents, selectEventFilter],
  (events, filter) =>
    filter === "ALL" ? events : events.filter((e) => e.source === filter),
);

export default eventLogSlice.reducer;
