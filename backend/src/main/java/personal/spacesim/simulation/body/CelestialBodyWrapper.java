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
import personal.spacesim.constants.PhysicsConstants;

@Getter
@Setter
@ToString
public class CelestialBodyWrapper {
    @JsonIgnore
    private final CelestialBody body;
    private final double mass;
    private final double radius;
    private final String name;
    private Vector3D position;
    private Vector3D velocity;


    public CelestialBodyWrapper(String name, Frame frame, AbsoluteDate date) {
        this.body = CelestialBodyFactory.getBody(name);
        this.name = name;
        this.mass = getMassConstant();
        Double radiusValue = PhysicsConstants.RADIUS_MAP.get(name.toUpperCase());
        if (radiusValue == null) {
            throw new IllegalArgumentException("Unknown celestial body: " + name);
        }
        this.radius = radiusValue;
        this.position = body.getPVCoordinates(date, frame).getPosition();
        this.velocity = body.getPVCoordinates(date, frame).getVelocity();
    }

    private double getMassConstant() {
        return body.getGM() / PhysicsConstants.GRAVITATIONAL_CONSTANT;
    }

}
