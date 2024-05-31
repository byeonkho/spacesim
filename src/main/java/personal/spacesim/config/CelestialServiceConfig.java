package personal.spacesim.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import personal.spacesim.services.implementation.EarthService;
import personal.spacesim.services.implementation.MarsService;
import personal.spacesim.services.implementation.MoonService;
import personal.spacesim.services.interfaces.PlanetaryOperations;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CelestialServiceConfig {

    @Bean
    public Map<String, PlanetaryOperations> celestialServices(EarthService earthService,
                                                              MoonService moonService,
                                                              MarsService marsService
                                                              ) {
        Map<String, PlanetaryOperations> services = new HashMap<>();
        services.put("earth", earthService);
        services.put("moon", moonService);
        services.put("mars", marsService);
        // Add other planet services here
        return services;
    }
}