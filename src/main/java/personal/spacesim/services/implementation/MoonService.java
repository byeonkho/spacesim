package personal.spacesim.services.implementation;
import org.springframework.stereotype.Service;


@Service
public class MoonService extends CelestialBodyWrapper {
    public MoonService() {
        super("MOON");
    }
}

