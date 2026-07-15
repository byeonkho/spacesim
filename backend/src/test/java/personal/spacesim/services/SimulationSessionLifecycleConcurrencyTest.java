package personal.spacesim.services;

import org.junit.jupiter.api.Test;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.simulation.ChunkResult;
import personal.spacesim.simulation.Simulation;
import personal.spacesim.simulation.SimulationFactory;
import personal.spacesim.utils.compressor.ZstdCompressor;
import personal.spacesim.utils.serializers.BinaryResponseSerializer;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.LockSupport;
import java.util.function.LongSupplier;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SimulationSessionLifecycleConcurrencyTest {

    private static final byte[] COMPRESSED_CHUNK = {2};
    private static final long TIMEOUT_SECONDS = 5;

    @Test
    void releaseDuringForegroundComputeRejectsLateResult() throws Exception {
        Harness harness = newHarness();
        CountDownLatch runStarted = new CountDownLatch(1);
        CountDownLatch allowRunToFinish = new CountDownLatch(1);
        when(harness.simulation().run()).thenAnswer(invocation -> {
            runStarted.countDown();
            assertTrue(allowRunToFinish.await(TIMEOUT_SECONDS, TimeUnit.SECONDS));
            return harness.chunkResult();
        });

        ExecutorService requestExecutor = Executors.newSingleThreadExecutor();
        try {
            Future<byte[]> response = requestExecutor.submit(
                    () -> harness.service().getNextChunkBytes(harness.sessionID(), 0));
            assertTrue(runStarted.await(TIMEOUT_SECONDS, TimeUnit.SECONDS));

            harness.service().removeSimulation(harness.sessionID());
            allowRunToFinish.countDown();

            ExecutionException failure = assertThrows(
                    ExecutionException.class,
                    () -> response.get(TIMEOUT_SECONDS, TimeUnit.SECONDS));
            assertAll(
                    () -> assertInstanceOf(SessionNotFoundException.class, failure.getCause()),
                    () -> assertReleased(harness)
            );
        } finally {
            allowRunToFinish.countDown();
            requestExecutor.shutdownNow();
        }
    }

    @Test
    void releaseWhileRequestAwaitsPrecomputeRejectsLateResult() throws Exception {
        Harness harness = newHarness();
        CountDownLatch precomputeStarted = new CountDownLatch(1);
        CountDownLatch allowPrecomputeToFinish = new CountDownLatch(1);
        when(harness.simulation().run()).thenReturn(harness.chunkResult()).thenAnswer(invocation -> {
            precomputeStarted.countDown();
            assertTrue(allowPrecomputeToFinish.await(TIMEOUT_SECONDS, TimeUnit.SECONDS));
            return harness.chunkResult();
        });

        ExecutorService requestExecutor = Executors.newSingleThreadExecutor();
        try {
            assertArrayEquals(COMPRESSED_CHUNK,
                    harness.service().getNextChunkBytes(harness.sessionID(), 0));
            assertTrue(precomputeStarted.await(TIMEOUT_SECONDS, TimeUnit.SECONDS));

            Future<byte[]> response = requestExecutor.submit(
                    () -> harness.service().getNextChunkBytes(harness.sessionID(), 1));
            awaitPrecomputeConsumption(harness.service(), harness.sessionID());

            harness.service().removeSimulation(harness.sessionID());
            allowPrecomputeToFinish.countDown();

            ExecutionException failure = assertThrows(
                    ExecutionException.class,
                    () -> response.get(TIMEOUT_SECONDS, TimeUnit.SECONDS));
            assertAll(
                    () -> assertInstanceOf(SessionNotFoundException.class, failure.getCause()),
                    () -> assertReleased(harness)
            );
        } finally {
            allowPrecomputeToFinish.countDown();
            requestExecutor.shutdownNow();
        }
    }

    @Test
    void idleEvictionReturnsWhilePrecomputeRunsAndLateCompletionStaysDiscarded()
            throws Exception {
        AtomicLong now = new AtomicLong(0L);
        Harness harness = newHarness(now::get);
        CountDownLatch precomputeStarted = new CountDownLatch(1);
        CountDownLatch allowPrecomputeToFinish = new CountDownLatch(1);
        CountDownLatch precomputeFinished = new CountDownLatch(1);
        when(harness.simulation().run()).thenReturn(harness.chunkResult()).thenAnswer(invocation -> {
            precomputeStarted.countDown();
            try {
                allowPrecomputeToFinish.await(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                precomputeFinished.countDown();
            }
            return harness.chunkResult();
        });

        assertArrayEquals(COMPRESSED_CHUNK,
                harness.service().getNextChunkBytes(harness.sessionID(), 0));
        assertTrue(precomputeStarted.await(TIMEOUT_SECONDS, TimeUnit.SECONDS));
        CompletableFuture<byte[]> pending =
                harness.service().peekPrecomputedChunk(harness.sessionID());
        assertNotNull(pending);

        now.set(TimeUnit.MINUTES.toMillis(16));
        ExecutorService evictionExecutor = Executors.newSingleThreadExecutor();
        try {
            Future<?> eviction = evictionExecutor.submit(
                    harness.service()::evictIdleSimulations);
            eviction.get(1, TimeUnit.SECONDS);

            assertTrue(pending.isCancelled());
            assertReleased(harness);

            allowPrecomputeToFinish.countDown();
            assertTrue(precomputeFinished.await(TIMEOUT_SECONDS, TimeUnit.SECONDS));
            assertReleased(harness);
        } finally {
            allowPrecomputeToFinish.countDown();
            evictionExecutor.shutdownNow();
        }
    }

    private static Harness newHarness() {
        return newHarness(System::currentTimeMillis);
    }

    private static Harness newHarness(LongSupplier currentTimeMillis) {
        SimulationFactory simulationFactory = mock(SimulationFactory.class);
        BinaryResponseSerializer serializer = mock(BinaryResponseSerializer.class);
        ZstdCompressor compressor = mock(ZstdCompressor.class);
        Simulation simulation = mock(Simulation.class);
        ChunkResult chunkResult = mock(ChunkResult.class);

        when(simulationFactory.createSimulation(
                anyString(), anyList(), anyString(), anyString(),
                any(AbsoluteDate.class), anyString(), anyInt(), anyInt()))
                .thenReturn(simulation);
        when(simulation.getCelestialBodies()).thenReturn(List.of());
        when(serializer.serialize(any(ChunkResult.class), any())).thenReturn(new byte[]{1});
        when(compressor.compress(any(byte[].class))).thenReturn(COMPRESSED_CHUNK);

        SimulationSessionService service = new SimulationSessionService(
                simulationFactory, serializer, compressor, currentTimeMillis);
        String sessionID = service.createSimulation(
                List.of("Sun"), "ICRF", "EULER", AbsoluteDate.J2000_EPOCH,
                "days", 1, 1);
        return new Harness(service, simulation, chunkResult, sessionID);
    }

    private static void awaitPrecomputeConsumption(
            SimulationSessionService service,
            String sessionID
    ) {
        long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(TIMEOUT_SECONDS);
        while (service.peekPrecomputedChunk(sessionID) != null) {
            if (System.nanoTime() >= deadline) {
                fail("request did not consume the precompute future before timeout");
            }
            LockSupport.parkNanos(TimeUnit.MILLISECONDS.toNanos(1));
        }
    }

    private static void assertReleased(Harness harness) {
        assertNull(harness.service().getSimulation(harness.sessionID()));
        assertNull(harness.service().peekPrecomputedChunk(harness.sessionID()));
        assertTrue(harness.service().getAllSimulations().isEmpty());
        assertThrows(SessionNotFoundException.class,
                () -> harness.service().getNextChunkBytes(harness.sessionID(), 0));
    }

    private record Harness(
            SimulationSessionService service,
            Simulation simulation,
            ChunkResult chunkResult,
            String sessionID
    ) {}
}
