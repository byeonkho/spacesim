package personal.spacesim.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import personal.spacesim.services.implementation.CelestialBodyWrapper;
import personal.spacesim.services.implementation.EarthService;
import personal.spacesim.services.implementation.MarsService;
import personal.spacesim.services.implementation.MoonService;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CelestialServiceConfig {

    @Bean
    public Map<String, CelestialBodyWrapper> celestialServices(EarthService earthService,
                                                               MoonService moonService,
                                                               MarsService marsService
                                                              ) {
        Map<String, CelestialBodyWrapper> services = new HashMap<>();
        services.put("earth", earthService);
        services.put("moon", moonService);
        services.put("mars", marsService);
        // Add other planet services here
        return services;
    }
}