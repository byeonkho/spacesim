package personal.spacesim.config;

import com.sun.net.httpserver.HttpServer;
import io.sentry.IScopes;
import io.sentry.spring7.SentryExceptionResolver;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.zip.GZIPInputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class SentryAutoConfigurationTest {

    private static CountDownLatch envelopeReceived;
    private static AtomicReference<String> probeEnvelope;
    private static HttpServer server;

    @Autowired
    private ApplicationContext context;

    @Autowired
    private IScopes scopes;

    @Autowired
    private SentryExceptionResolver resolver;

    @DynamicPropertySource
    static void sentryProperties(DynamicPropertyRegistry registry) {
        envelopeReceived = new CountDownLatch(1);
        probeEnvelope = new AtomicReference<>();
        try {
            server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to start fake Sentry endpoint", e);
        }
        server.createContext("/", exchange -> {
            try {
                byte[] body = exchange.getRequestBody().readAllBytes();
                if ("gzip".equalsIgnoreCase(
                        exchange.getRequestHeaders().getFirst("Content-Encoding"))) {
                    body = new GZIPInputStream(
                            new ByteArrayInputStream(body)).readAllBytes();
                }
                String envelope = new String(body, StandardCharsets.UTF_8);
                if (envelope.contains("boot4-sentry-probe")
                        && envelope.contains("Spring7ExceptionResolver")) {
                    probeEnvelope.set(envelope);
                    envelopeReceived.countDown();
                }
                exchange.sendResponseHeaders(200, -1);
            } finally {
                exchange.close();
            }
        });
        server.start();

        registry.add(
                "sentry.dsn",
                () -> "http://public@127.0.0.1:"
                        + server.getAddress().getPort()
                        + "/1");
        registry.add("sentry.traces-sample-rate", () -> "0");
    }

    @AfterAll
    static void stopServer() {
        if (server != null) {
            server.stop(0);
        }
    }

    @Test
    void boot4AutoConfigurationWiresMvcAndSendsEvents() throws Exception {
        assertEquals(resolver, context.getBean(SentryExceptionResolver.class));
        assertTrue(scopes.isEnabled(), "Sentry scopes must be enabled with a DSN");

        MockHttpServletRequest request =
                new MockHttpServletRequest("GET", "/api/simulation/probe");
        MockHttpServletResponse response = new MockHttpServletResponse();
        resolver.resolveException(
                request,
                response,
                null,
                new IllegalStateException("boot4-sentry-probe"));
        scopes.flush(5_000);

        assertTrue(
                envelopeReceived.await(5, TimeUnit.SECONDS),
                "the local endpoint must receive the MVC resolver's probe envelope");
        assertNotNull(probeEnvelope.get());
        assertTrue(probeEnvelope.get().contains("boot4-sentry-probe"));
        assertTrue(probeEnvelope.get().contains("Spring7ExceptionResolver"));
    }
}
