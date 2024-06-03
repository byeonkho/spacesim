package personal.spacesim.config;

import org.orekit.frames.Frame;
import org.orekit.frames.FramesFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import personal.spacesim.orekit.CustomFrameFactory;
import personal.spacesim.services.implementation.EarthService;
import personal.spacesim.services.implementation.MarsService;
import personal.spacesim.services.implementation.MoonService;


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

    @Bean
    public MarsService marsService() {
        return new MarsService();
    }

    @Bean
    public MoonService moonService() {
        return new MoonService();
    }
}
