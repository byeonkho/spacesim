package personal.spacesim.simulation.body;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.bodies.CelestialBody;
import org.orekit.bodies.CelestialBodyFactory;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.utils.CustomConstants;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@ToString
public class CelestialBodyWrapper {
    @JsonIgnore
    private final CelestialBody body;
    @JsonIgnore
    private final double mass;
    @JsonIgnore
    private final double radius;
    private final String name;
    private Vector3D position;
    private Vector3D velocity;
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

    public CelestialBodyWrapper(String name, Frame frame, AbsoluteDate date) {
        this.body = CelestialBodyFactory.getBody(name);
        this.name = name;
        this.mass = getMassConstant();
        this.radius = getRadiusByName(name);
        this.position = body.getPVCoordinates(date, frame).getPosition();
        this.velocity = body.getPVCoordinates(date, frame).getVelocity();
    }

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
