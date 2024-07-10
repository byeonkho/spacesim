package personal.spacesim.services.implementation;
import org.springframework.stereotype.Service;


@Service
public class SunService extends CelestialBodyWrapper {
    public SunService() {
        super("SUN");
    }
}

