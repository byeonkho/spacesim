package personal.spacesim.services;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.bodies.CelestialBody;
import org.orekit.bodies.CelestialBodyFactory;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.orekit.utils.PVCoordinates;
import org.springframework.stereotype.Service;

@Service
public class CelestialService {

    public Vector3D getEarthPosition(Frame frame, AbsoluteDate date) {
        CelestialBody earth = CelestialBodyFactory.getEarth();
        PVCoordinates earthPV = earth.getPVCoordinates(date, frame);
        return earthPV.getPosition();
    }

    public Vector3D getEarthVelocity(Frame frame, AbsoluteDate date) {
        CelestialBody earth = CelestialBodyFactory.getEarth();
        PVCoordinates earthPV = earth.getPVCoordinates(date, frame);
        return earthPV.getVelocity();
    }
}
