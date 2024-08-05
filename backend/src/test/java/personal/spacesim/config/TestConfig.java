package personal.spacesim.config;

import org.orekit.frames.Frame;
import org.orekit.frames.FramesFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestConfig {

    @Bean
    public Frame icrfFrame() {
        return FramesFactory.getICRF();
    }

    @Bean
    public Frame gcrfFrame() {
        return FramesFactory.getGCRF();
    }

}
