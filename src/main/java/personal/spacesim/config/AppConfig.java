package personal.spacesim.config;

import org.orekit.frames.Frame;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import personal.spacesim.orekit.CustomFrameFactory;
import personal.spacesim.services.implementation.EarthService;


@Configuration
public class AppConfig {

    @Bean
    public Frame heliocentricFrame() {
        return CustomFrameFactory.createHeliocentricFrame();
    }

    @Bean
    public EarthService earthService() {
        return new EarthService();
    }
}
