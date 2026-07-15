import type { Middleware } from "@reduxjs/toolkit";
import {
  appendChunkToBuffer,
  loadSimulation,
  selectBufferStartTimestep,
  selectChunkBuffer,
  selectCurrentTimeStepIndex,
  setCurrentTimeStepIndex,
} from "@/app/store/slices/SimulationSlice";
import {
  addDetectedEvents,
  eventsToNarrate,
  markEventsNarrated,
  resetNotableEvents,
  selectDetectedEvents,
} from "@/app/store/slices/NotableEventsSlice";
import {
  invalidateSimSeekTargets,
  pushEvent,
} from "@/app/store/slices/EventLogSlice";
import { NotableEventStreamScanner } from "@/app/utils/notableEventStreamScanner";

export function createNotableEventsMiddleware(): Middleware {
  const scanner = new NotableEventStreamScanner();

  return (storeApi) => {
    const narrateEligibleEvents = (): void => {
      const state = storeApi.getState();
      const buffer = selectChunkBuffer(state);
      if (buffer === null) return;
      const playheadGlobal =
        Math.floor(selectCurrentTimeStepIndex(state)) +
        selectBufferStartTimestep(state);
      const detectedEvents = selectDetectedEvents(state);

      let hasEligibleEvent = false;
      for (let index = 0; index < detectedEvents.length; index++) {
        const event = detectedEvents[index];
        if (event.timeIndex > playheadGlobal) break;
        if (!event.narrated) {
          hasEligibleEvent = true;
          break;
        }
      }
      if (!hasEligibleEvent) return;

      const toNarrate = eventsToNarrate(detectedEvents, playheadGlobal);
      const narratedIds: number[] = [];
      for (const event of toNarrate) {
        storeApi.dispatch(
          pushEvent({
            source: "SIM",
            severity: event.severity,
            message: event.message,
            timeIndex: event.timeIndex,
          }),
        );
        narratedIds.push(event.id);
      }
      storeApi.dispatch(markEventsNarrated(narratedIds));
    };

    return (next) => (action) => {
      const result = next(action);

      if (loadSimulation.match(action)) {
        scanner.reset();
        storeApi.dispatch(resetNotableEvents());
        storeApi.dispatch(invalidateSimSeekTargets());
        return result;
      }

      if (appendChunkToBuffer.match(action)) {
        const state = storeApi.getState();
        const buffer = selectChunkBuffer(state);
        if (buffer === null) return result;
        const bufferStartTimestep = selectBufferStartTimestep(state);
        const payloadStartGlobal =
          buffer.bufferStartTimestep +
          buffer.totalTimesteps -
          action.payload.timestepCount;
        try {
          const events = scanner.consume(action.payload, payloadStartGlobal);
          scanner.pruneBefore(bufferStartTimestep);
          storeApi.dispatch(
            addDetectedEvents({ events, bufferStartTimestep }),
          );
        } catch (error) {
          scanner.pruneBefore(bufferStartTimestep);
          storeApi.dispatch(
            addDetectedEvents({ events: [], bufferStartTimestep }),
          );
          console.warn("[events] skipped an unsafe append boundary", error);
        }
        narrateEligibleEvents();
        return result;
      }

      if (setCurrentTimeStepIndex.match(action)) {
        narrateEligibleEvents();
      }

      return result;
    };
  };
}
