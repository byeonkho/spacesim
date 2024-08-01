package personal.spacesim.simulation.body;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.bodies.CelestialBody;
import org.orekit.bodies.CelestialBodyFactory;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.utils.Constants;

// Wrapper class that provides additional information and methods for the CelestialBody objects initialized via Orekit.
// The wrapper is necessary to save the position and velocity state updates for each body, without which we'd have to
// query Orekit directly (defeating the purpose of the sim)

public class CelestialBodyWrapper {
    private final CelestialBody body;
    private final double mass;
    private Vector3D position;
    private Vector3D velocity;

    public CelestialBodyWrapper(String name, Frame frame, AbsoluteDate date) {
        this.body = CelestialBodyFactory.getBody(name);
        this.mass = this.getMass();
        this.position = body.getPVCoordinates(date, frame).getPosition();
        this.velocity = body.getPVCoordinates(date, frame).getVelocity();
    }

    public double getMass() {
        return body.getGM() / Constants.GRAVITATIONAL_CONSTANT;
    }

    public String getName() {
        return body.getName();
    }

    public void setPosition(Vector3D position) {
        this.position = position;
    }

    public void setVelocity(Vector3D velocity) {
        this.velocity = velocity;
    }

    public Vector3D getPosition() {
        return position;
    }

    public Vector3D getVelocity() {
        return velocity;
    }

}
