package personal.spacesim.simulation.body;

import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.springframework.stereotype.Component;

@Component
public class CelestialBodyWrapperFactory {
    public CelestialBodyWrapper createCelestialBodyWrapper(String name, Frame frame, AbsoluteDate date) {
        CelestialBodyWrapper celestialBodyWrapper = new CelestialBodyWrapper(name, frame, date);

        if (name.equalsIgnoreCase("MOON")) {
            celestialBodyWrapper.setOrbitingBody("EARTH");
        }  else {
            celestialBodyWrapper.setOrbitingBody("SUN");
        }

        return celestialBodyWrapper;
    }
}