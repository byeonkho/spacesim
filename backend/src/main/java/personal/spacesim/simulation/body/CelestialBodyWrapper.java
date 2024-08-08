package personal.spacesim.simulation.body;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.tomcat.util.bcel.Const;
import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.bodies.CelestialBody;
import org.orekit.bodies.CelestialBodyFactory;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.orekit.utils.Constants;
import personal.spacesim.utils.CustomConstants;

import java.util.HashMap;
import java.util.Map;

// Wrapper class that provides additional information and methods for the CelestialBody objects initialized via Orekit.
// The wrapper is necessary to save the position and velocity state updates for each body, without which we'd have to
// query Orekit directly (defeating the purpose of the sim)

public class CelestialBodyWrapper {
    private final CelestialBody body;

    @JsonIgnore // make Jackson ignore during serialization for REST call to avoid duplication; using the
    // SimulationResponseMetadata object instead.
    private final double mass;
    @JsonIgnore
    private final double radius;

    private Vector3D position;
    private Vector3D velocity;

    public CelestialBodyWrapper(String name, Frame frame, AbsoluteDate date) {
        this.body = CelestialBodyFactory.getBody(name);
        this.mass = getMassConstant();
        this.radius = getRadiusByName(name);
        this.position = body.getPVCoordinates(date, frame).getPosition();
        this.velocity = body.getPVCoordinates(date, frame).getVelocity();
    }

    // constants mapping for planetary radius
    private static final Map<String, Double> radiusMap = new HashMap<>();

    static {
        radiusMap.put("earth", CustomConstants.EARTH_RADIUS);
        radiusMap.put("mars", CustomConstants.MARS_RADIUS);
        radiusMap.put("moon", CustomConstants.MOON_RADIUS);
        radiusMap.put("sun", CustomConstants.SUN_RADIUS);
        radiusMap.put("venus", CustomConstants.VENUS_RADIUS);
        radiusMap.put("mercury", CustomConstants.MERCURY_RADIUS);
        radiusMap.put("jupiter", CustomConstants.JUPITER_RADIUS);
        radiusMap.put("saturn", CustomConstants.SATURN_RADIUS);
        radiusMap.put("uranus", CustomConstants.URANUS_RADIUS);
        radiusMap.put("neptune", CustomConstants.NEPTUNE_RADIUS);
    }

    // Getters and setters
    public double getRadius() {
        return radius;
    }

    public double getMass() {
        return mass;
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

    // private Getters so Jackson doesn't serialize this; used only by constructor
    private double getMassConstant() {
        return body.getGM() / CustomConstants.GRAVITATIONAL_CONSTANT;
    }

    private double getRadiusByName(String name) {
        Double radiusResult = radiusMap.get(name.toLowerCase());
        if (radiusResult == null) {
            throw new IllegalArgumentException("Unknown celestial body: " + name);
        }
        return radiusResult;
    }
}
