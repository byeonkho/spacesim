package personal.spacesim.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import personal.spacesim.simulation.FrameContext;
import personal.spacesim.utils.math.integration.EulerIntegrator;
import personal.spacesim.utils.math.integration.Integrator;

@Configuration
public class SimulationConfig {

    @Bean
    public Integrator integrator() {
        return new EulerIntegrator();
    }

    @Bean
    public FrameContext frameContext() {
        return new FrameContext(); // You can pass initial parameters if needed
    }
}
