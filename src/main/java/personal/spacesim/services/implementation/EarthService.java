package personal.spacesim.services.implementation;


import org.springframework.stereotype.Service;

@Service
public class EarthService extends CelestialBodyWrapper {
    public EarthService() {
        super("EARTH");
    }
}

