package personal.spacesim.services.implementation;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.bodies.CelestialBody;
import org.orekit.bodies.CelestialBodyFactory;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import personal.spacesim.orekit.CustomFrameFactory;
import personal.spacesim.utils.Constants;

// Wrapper class that provides additional information and methods for the CelestialBody objects initialized via Orekit.
public class CelestialBodyWrapper {
    private final CelestialBody body;
    private final double mass;
    private Vector3D position;
    private Vector3D velocity;
    private AbsoluteDate defaultDate = new AbsoluteDate(2024, 5, 1, TimeScalesFactory.getUTC());
    private Frame defaultFrame;

    public CelestialBodyWrapper(String name, Frame frame, AbsoluteDate date) {
        this.body = CelestialBodyFactory.getBody(name);
        this.mass = this.getMass();
        this.position = body.getPVCoordinates(date, frame).getPosition();
        this.velocity = body.getPVCoordinates(date, frame).getVelocity();

    }

    public CelestialBodyWrapper(String name) {
        this.body = CelestialBodyFactory.getBody(name);
        this.mass = this.getMass();
        this.defaultFrame = CustomFrameFactory.createHeliocentricFrame();
        this.position = body.getPVCoordinates(defaultDate, defaultFrame).getPosition();
        this.velocity = body.getPVCoordinates(defaultDate, defaultFrame).getVelocity();
    }

    public Vector3D getPosition(Frame frame, AbsoluteDate date) {
        return body.getPVCoordinates(date, frame).getPosition();
    }

    public Vector3D getVelocity(Frame frame, AbsoluteDate date) {
        return body.getPVCoordinates(date, frame).getVelocity();
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

    public Vector3D getCurrentPosition() {
        return position;
    }

    public Vector3D getCurrentVelocity() {
        return velocity;
    }

}
