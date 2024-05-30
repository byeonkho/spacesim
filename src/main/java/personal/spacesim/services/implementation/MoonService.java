package personal.spacesim.services.implementation;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.bodies.CelestialBody;
import org.orekit.bodies.CelestialBodyFactory;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.orekit.utils.PVCoordinates;
import org.springframework.stereotype.Service;
import personal.spacesim.services.interfaces.PlanetaryOperations;

@Service
public class MoonService implements PlanetaryOperations {

    private final CelestialBody moon;

    public MoonService() {
        this.moon = CelestialBodyFactory.getMoon();
    }

    @Override
    public Vector3D getPosition(Frame frame, AbsoluteDate date) {
        PVCoordinates moonPV = moon.getPVCoordinates(date, frame);
        return moonPV.getPosition();
    }

    @Override
    public Vector3D getVelocity(Frame frame, AbsoluteDate date) {
        PVCoordinates moonPV = moon.getPVCoordinates(date, frame);
        return moonPV.getVelocity();
    }
}

