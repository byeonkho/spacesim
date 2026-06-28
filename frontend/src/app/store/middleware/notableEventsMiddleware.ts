import type { Middleware } from "@reduxjs/toolkit";
import {
  appendChunkToBuffer,
  loadSimulation,
  setCurrentTimeStepIndex,
  selectChunkBuffer,
  selectCurrentTimeStepIndex,
  selectBufferStartTimestep,
} from "@/app/store/slices/SimulationSlice";
import {
  addDetectedEvents,
  advanceNarrationCursor,
  resetNotableEvents,
  selectDetectedEvents,
  selectNarrationCursorGlobal,
  eventsToNarrate,
} from "@/app/store/slices/NotableEventsSlice";
import { pushEvent } from "@/app/store/slices/EventLogSlice";
import { scanBuffer } from "@/app/utils/eventScanner";

// Single driver for the notable-events feature. Mirrors groundTruthMiddleware:
// it reacts to appendChunkToBuffer (the one action both the live and static-
// clip paths dispatch). Scan runs on the main thread; for the default static
// clip and typical body counts that is a few hundred-thousand cheap ops, on the
// order of rebuildTrueTrack which already runs here. (A future optimisation
// could move the scan into the decode worker.)

let scanHighWaterGlobal = 0;

export const notableEventsMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action);

  if (loadSimulation.match(action)) {
    scanHighWaterGlobal = 0;
    storeApi.dispatch(resetNotableEvents());
    return result;
  }

  if (appendChunkToBuffer.match(action)) {
    const state = storeApi.getState();
    const buffer = selectChunkBuffer(state);
    if (!buffer) return result;
    const events = scanBuffer(buffer, scanHighWaterGlobal);
    const bufferStartTimestep = selectBufferStartTimestep(state);
    storeApi.dispatch(addDetectedEvents({ events, bufferStartTimestep }));
    scanHighWaterGlobal = buffer.bufferStartTimestep + buffer.totalTimesteps - 1;
    return result;
  }

  if (setCurrentTimeStepIndex.match(action)) {
    const state = storeApi.getState();
    const buffer = selectChunkBuffer(state);
    if (!buffer) return result;
    const bufferStart = selectBufferStartTimestep(state);
    const playheadGlobal = Math.floor(selectCurrentTimeStepIndex(state)) + bufferStart;
    const cursor = selectNarrationCursorGlobal(state);
    const toNarrate = eventsToNarrate(
      selectDetectedEvents(state),
      cursor,
      playheadGlobal,
    );
    if (toNarrate.length === 0) return result;
    for (const e of toNarrate) {
      storeApi.dispatch(
        pushEvent({
          source: "SIM",
          severity: e.severity,
          message: e.message,
          timeIndex: e.timeIndex,
        }),
      );
    }
    storeApi.dispatch(advanceNarrationCursor(playheadGlobal));
    return result;
  }

  return result;
};
