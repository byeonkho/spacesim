package personal.spacesim.config;

import com.sun.net.httpserver.HttpServer;
import io.sentry.IScopes;
import io.sentry.spring7.SentryExceptionResolver;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class SentryAutoConfigurationTest {

    private static final CountDownLatch ENVELOPE_RECEIVED = new CountDownLatch(1);
    private static HttpServer server;

    @Autowired
    private ApplicationContext context;

    @Autowired
    private IScopes scopes;

    @DynamicPropertySource
    static void sentryProperties(DynamicPropertyRegistry registry) {
        try {
            server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to start fake Sentry endpoint", e);
        }
        server.createContext("/", exchange -> {
            try {
                exchange.getRequestBody().transferTo(OutputStream.nullOutputStream());
                exchange.sendResponseHeaders(200, -1);
            } finally {
                exchange.close();
                ENVELOPE_RECEIVED.countDown();
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
        assertNotNull(context.getBean(SentryExceptionResolver.class));
        assertTrue(scopes.isEnabled(), "Sentry scopes must be enabled with a DSN");

        scopes.captureException(new IllegalStateException("boot4-sentry-probe"));
        scopes.flush(5_000);

        assertTrue(
                ENVELOPE_RECEIVED.await(5, TimeUnit.SECONDS),
                "the local endpoint must receive a Sentry envelope");
    }
}
