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
    const detectedEvents = selectDetectedEvents(state);
    // This branch runs every frame during playback. Do an allocation-free
    // pre-scan first and only build the filtered array on the rare frame that
    // actually crosses an event, to keep per-frame garbage off the hot path.
    let crossed = false;
    for (let i = 0; i < detectedEvents.length; i++) {
      const ti = detectedEvents[i].timeIndex;
      if (ti > cursor && ti <= playheadGlobal) {
        crossed = true;
        break;
      }
    }
    if (!crossed) return result;
    const toNarrate = eventsToNarrate(detectedEvents, cursor, playheadGlobal);
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
