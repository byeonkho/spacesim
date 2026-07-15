import { Vector3 } from "three";
import {
  createChunkBuffer,
  getTimestampAsIsoString,
  readBodyPositionInto,
  type ChunkBuffer,
} from "@/app/store/chunkBuffer";
import {
  describePerihelion,
  REFINE_SUBSTEPS,
  type DetectedEvent,
} from "@/app/utils/eventScanner";

export interface ScannerChunkPayload {
  bodyNames: string[];
  bodyCount: number;
  timestepCount: number;
  positions: Float64Array;
  timestamps: Float64Array;
}

export class NotableEventStreamScanner {
  private expectedBodyNames: string[] | null = null;
  private nextGlobalIndex: number | null = null;
  private window: ChunkBuffer | null = null;
  private primaryIndex = -1;
  private readonly scratchA = new Vector3();
  private readonly scratchB = new Vector3();

  consume(
    chunk: ScannerChunkPayload,
    startGlobalIndex: number,
  ): DetectedEvent[] {
    try {
      this.validateChunk(chunk, startGlobalIndex);
      this.ensureSchema(chunk.bodyNames);
      if (
        this.nextGlobalIndex !== null &&
        startGlobalIndex !== this.nextGlobalIndex
      ) {
        throw new Error(
          `notable-event index discontinuity: expected ${this.nextGlobalIndex}, received ${startGlobalIndex}`,
        );
      }

      const events: DetectedEvent[] = [];
      for (let sample = 0; sample < chunk.timestepCount; sample++) {
        this.pushFrame(chunk, sample, startGlobalIndex + sample);
        if (this.window?.totalTimesteps === 3) {
          this.detectSunRelativeExtrema(events);
        }
      }
      this.nextGlobalIndex = startGlobalIndex + chunk.timestepCount;
      events.sort((a, b) => a.timeIndex - b.timeIndex);
      return events;
    } catch (error) {
      this.clearCarry();
      throw error;
    }
  }

  pruneBefore(minGlobalIndex: number): void {
    void minGlobalIndex;
    // Sun-relative extrema emit immediately, so no candidate needs pruning.
  }

  reset(): void {
    this.expectedBodyNames = null;
    this.primaryIndex = -1;
    this.window = null;
    this.nextGlobalIndex = null;
  }

  private validateChunk(
    chunk: ScannerChunkPayload,
    startGlobalIndex: number,
  ): void {
    if (!Number.isInteger(startGlobalIndex) || startGlobalIndex < 0) {
      throw new Error(
        "notable-event start index must be a non-negative integer",
      );
    }
    if (
      !Number.isInteger(chunk.timestepCount) ||
      chunk.timestepCount < 1 ||
      chunk.bodyCount !== chunk.bodyNames.length ||
      chunk.positions.length !== chunk.timestepCount * chunk.bodyCount * 6 ||
      chunk.timestamps.length !== chunk.timestepCount
    ) {
      throw new Error("malformed notable-event chunk payload");
    }
    if (
      this.expectedBodyNames !== null &&
      (chunk.bodyNames.length !== this.expectedBodyNames.length ||
        chunk.bodyNames.some(
          (name, index) => name !== this.expectedBodyNames?.[index],
        ))
    ) {
      throw new Error("notable-event body schema changed within a run");
    }
  }

  private ensureSchema(bodyNames: string[]): void {
    if (this.expectedBodyNames !== null) return;
    const schema = [...bodyNames];
    this.expectedBodyNames = schema;
    this.window = createChunkBuffer(schema, 3);
    this.primaryIndex = bodyNames.findIndex(
      (name) => name.toUpperCase() === "SUN",
    );
  }

  private clearCarry(): void {
    this.nextGlobalIndex = null;
    if (this.window !== null) {
      this.window.totalTimesteps = 0;
      this.window.bufferStartTimestep = 0;
    }
  }

  private pushFrame(
    chunk: ScannerChunkPayload,
    sample: number,
    globalIndex: number,
  ): void {
    const window = this.window;
    if (window === null) {
      throw new Error("notable-event scanner has no schema");
    }
    const stride = chunk.bodyCount * 6;
    let destination: number;
    if (window.totalTimesteps < 3) {
      destination = window.totalTimesteps;
      window.totalTimesteps += 1;
    } else {
      window.positions.copyWithin(0, stride, stride * 3);
      window.timestamps[0] = window.timestamps[1];
      window.timestamps[1] = window.timestamps[2];
      destination = 2;
    }
    const sourceBase = sample * stride;
    const destinationBase = destination * stride;
    for (let offset = 0; offset < stride; offset++) {
      window.positions[destinationBase + offset] =
        chunk.positions[sourceBase + offset];
    }
    window.timestamps[destination] = chunk.timestamps[sample];
    window.bufferStartTimestep = globalIndex - window.totalTimesteps + 1;
  }

  private distanceAt(localIndex: number, a: number, b: number): number {
    const window = this.window;
    if (window === null) {
      throw new Error("notable-event scanner has no window");
    }
    readBodyPositionInto(this.scratchA, window, localIndex, a);
    readBodyPositionInto(this.scratchB, window, localIndex, b);
    return this.scratchA.distanceTo(this.scratchB);
  }

  private refineSunExtremum(
    bodyIndex: number,
    kind: "perihelion" | "aphelion",
  ): { localIndex: number; distance: number } {
    const wantMinimum = kind === "perihelion";
    let bestIndex = 1;
    let bestDistance = this.distanceAt(1, bodyIndex, this.primaryIndex);
    const total = REFINE_SUBSTEPS * 2;
    for (let step = 0; step <= total; step++) {
      const localIndex = (2 * step) / total;
      const distance = this.distanceAt(
        localIndex,
        bodyIndex,
        this.primaryIndex,
      );
      if (wantMinimum ? distance < bestDistance : distance > bestDistance) {
        bestDistance = distance;
        bestIndex = localIndex;
      }
    }
    return { localIndex: bestIndex, distance: bestDistance };
  }

  private detectSunRelativeExtrema(events: DetectedEvent[]): void {
    const window = this.window;
    if (window === null || this.primaryIndex < 0) return;
    for (let bodyIndex = 0; bodyIndex < window.bodyCount; bodyIndex++) {
      if (bodyIndex === this.primaryIndex) continue;
      const previous = this.distanceAt(0, bodyIndex, this.primaryIndex);
      const center = this.distanceAt(1, bodyIndex, this.primaryIndex);
      const next = this.distanceAt(2, bodyIndex, this.primaryIndex);
      const kind =
        center < previous && center < next
          ? "perihelion"
          : center > previous && center > next
            ? "aphelion"
            : null;
      if (kind === null) continue;
      const refined = this.refineSunExtremum(bodyIndex, kind);
      const isoDate = getTimestampAsIsoString(
        window,
        Math.round(refined.localIndex),
      );
      events.push({
        type: kind,
        timeIndex: window.bufferStartTimestep + refined.localIndex,
        bodies: [window.bodyNames[bodyIndex]],
        severity: "info",
        magnitude: refined.distance,
        message: describePerihelion(window.bodyNames[bodyIndex], isoDate, kind),
      });
    }
  }
}
