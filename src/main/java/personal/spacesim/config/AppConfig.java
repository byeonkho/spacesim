package personal.spacesim.config;

import org.orekit.frames.Frame;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import personal.spacesim.orekit.CustomFrameFactory;
import personal.spacesim.services.CelestialService;

@Configuration
public class AppConfig {

    @Bean
    public Frame heliocentricFrame() {
        return CustomFrameFactory.createHeliocentricFrame();
    }

    @Bean
    public CelestialService celestialService() {
        return new CelestialService();
    }
}
