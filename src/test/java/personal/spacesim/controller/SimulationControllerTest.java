package personal.spacesim.apis.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import personal.spacesim.simulation.FrameWrapper;
import personal.spacesim.simulation.Simulation;
import personal.spacesim.config.TestConfig;

import java.util.List;
import java.util.Random;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SimulationController.class)
@Import(TestConfig.class)
public class SimulationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private Simulation simulation;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        Random rand = new Random();
        Math.random();
    }

    @Test
    public void testInitializeSimulationResponseOK() throws Exception {
        String jsonRequest = "{ \"celestialBodyNames\": [\"Earth\", \"Mars\"], \"dateStr\": \"2024-06-05T00:00:00.000\", \"frame\": \"ICRF\" }";

        mockMvc.perform(post("/api/simulation/initialize")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(jsonRequest))
                .andExpect(status().isOk());
    }
}