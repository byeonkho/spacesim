package personal.spacesim.apis.filters;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "ALLOWED_ORIGINS=https://allowed.example",
        "spacesim.origin-secret=integration-secret"
})
@AutoConfigureMockMvc
class ServletSecurityIntegrationTest {

    private static final String INITIALIZE_PATH = "/api/simulation/initialize";
    private static final String ALLOWED_ORIGIN = "https://allowed.example";
    private static final String ORIGIN_SECRET_HEADER = "X-Origin-Secret";
    private static final String ORIGIN_SECRET = "integration-secret";
    private static final String INVALID_INITIALIZE_BODY = "{}";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void allowedCorsPreflightSucceeds() throws Exception {
        mockMvc.perform(options(INITIALIZE_PATH)
                        .header(HttpHeaders.ORIGIN, ALLOWED_ORIGIN)
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .header("CF-Connecting-IP", "192.0.2.11"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED_ORIGIN))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET,POST"));
    }

    @Test
    void disallowedCorsPreflightIsRejected() throws Exception {
        mockMvc.perform(options(INITIALIZE_PATH)
                        .header(HttpHeaders.ORIGIN, "https://disallowed.example")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .header("CF-Connecting-IP", "192.0.2.12"))
                .andExpect(status().isForbidden());
    }

    @Test
    void missingOriginSecretReturnsSanitizedForbiddenResponse() throws Exception {
        mockMvc.perform(post(INITIALIZE_PATH)
                        .header(HttpHeaders.ORIGIN, ALLOWED_ORIGIN)
                        .header("CF-Connecting-IP", "198.51.100.13")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(INVALID_INITIALIZE_BODY))
                .andExpect(status().isForbidden())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(content().string("{\"error\":\"Forbidden\"}"));
    }

    @Test
    void exhaustedClientIsRateLimitedButMissingSecretStillReturnsForbidden() throws Exception {
        String clientIp = "203.0.113.14";

        for (int requestNumber = 1; requestNumber <= 20; requestNumber++) {
            mockMvc.perform(post(INITIALIZE_PATH)
                            .header(HttpHeaders.ORIGIN, ALLOWED_ORIGIN)
                            .header(ORIGIN_SECRET_HEADER, ORIGIN_SECRET)
                            .header("CF-Connecting-IP", clientIp)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(INVALID_INITIALIZE_BODY))
                    .andExpect(status().isBadRequest());
        }

        MvcResult rateLimited = mockMvc.perform(post(INITIALIZE_PATH)
                        .header(HttpHeaders.ORIGIN, ALLOWED_ORIGIN)
                        .header(ORIGIN_SECRET_HEADER, ORIGIN_SECRET)
                        .header("CF-Connecting-IP", clientIp)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(INVALID_INITIALIZE_BODY))
                .andExpect(status().isTooManyRequests())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED_ORIGIN))
                .andExpect(header().exists(HttpHeaders.RETRY_AFTER))
                .andReturn();

        String retryAfter = rateLimited.getResponse().getHeader(HttpHeaders.RETRY_AFTER);
        assertNotNull(retryAfter);
        assertTrue(Long.parseLong(retryAfter) > 0);
        assertEquals(
                "{\"error\":\"Rate limit exceeded\",\"retryAfterSeconds\":" + retryAfter + "}",
                rateLimited.getResponse().getContentAsString()
        );

        mockMvc.perform(post(INITIALIZE_PATH)
                        .header(HttpHeaders.ORIGIN, ALLOWED_ORIGIN)
                        .header("CF-Connecting-IP", clientIp)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(INVALID_INITIALIZE_BODY))
                .andExpect(status().isForbidden())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(content().string("{\"error\":\"Forbidden\"}"));
    }
}
