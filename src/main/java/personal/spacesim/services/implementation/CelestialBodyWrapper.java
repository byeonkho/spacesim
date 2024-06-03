package personal.spacesim.services.implementation;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.bodies.CelestialBody;
import org.orekit.bodies.CelestialBodyFactory;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;

public class CelestialBodyWrapper {
    private CelestialBody body;

    public CelestialBodyWrapper(String name) {
        this.body = CelestialBodyFactory.getBody(name);
    }

    public Vector3D getPosition(Frame frame, AbsoluteDate date) {
        return body.getPVCoordinates(date, frame).getPosition();
    }

    public Vector3D getVelocity(Frame frame, AbsoluteDate date) {
        return body.getPVCoordinates(date, frame).getVelocity();
    }
}