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
public class MarsService implements PlanetaryOperations {

    private final CelestialBody mars;

    public MarsService() {
        this.mars = CelestialBodyFactory.getMars();
    }

    @Override
    public Vector3D getPosition(Frame frame, AbsoluteDate date) {
        PVCoordinates marsPV = mars.getPVCoordinates(date, frame);
        return marsPV.getPosition();
    }

    @Override
    public Vector3D getVelocity(Frame frame, AbsoluteDate date) {
        PVCoordinates marsPV = mars.getPVCoordinates(date, frame);
        return marsPV.getVelocity();
    }
}

