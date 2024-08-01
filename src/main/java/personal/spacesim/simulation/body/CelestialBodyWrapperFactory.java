package personal.spacesim.simulation.body;

import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.springframework.stereotype.Component;

@Component
public class CelestialBodyWrapperFactory {

    public CelestialBodyWrapper createCelestialBodyWrapper(String name, Frame frame, AbsoluteDate date) {
        return new CelestialBodyWrapper(name, frame, date);
    }

    // Additional factory methods can be added here as needed
}