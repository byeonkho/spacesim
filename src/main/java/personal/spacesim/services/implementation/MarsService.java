package personal.spacesim.services.implementation;
import org.springframework.stereotype.Service;


@Service
public class MarsService extends CelestialBodyWrapper {
    public MarsService() {
        super("MARS");
    }
}

