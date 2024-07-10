package personal.spacesim.config;

import org.orekit.time.AbsoluteDate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import personal.spacesim.simulation.FrameWrapper;
import personal.spacesim.utils.math.integration.EulerIntegrator;
import personal.spacesim.utils.math.integration.Integrator;

@Configuration
public class SimulationConfig {

    @Bean
    public Integrator integrator() {
        return new EulerIntegrator();
    }

    @Bean
    public FrameWrapper frameContext() {
        return new FrameWrapper(); // You can pass initial parameters if needed
    }

//    @Bean
//    public SimStartDate simulationDate() {
//        return new SimStartDate(AbsoluteDate.J2000_EPOCH); // Default value, can be updated as needed
//    }
}

