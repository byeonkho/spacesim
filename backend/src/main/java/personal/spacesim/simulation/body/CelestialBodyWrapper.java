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


// we can't just use CelestialBody because to retrieve the PV coordinates we need a specific datetime; by wrapping it
// here we can update the PV state through our manual compute.

@Getter
@Setter
@ToString
public class CelestialBodyWrapper {

    private final double mass;
    private final double radius;
    private final String name;
    private String orbitingBody;

    @JsonIgnore
    private Vector3D position;
    @JsonIgnore
    private Vector3D velocity;

    public CelestialBodyWrapper(
            String name,
            Frame frame,
            AbsoluteDate date
    ) {

        CelestialBody body = CelestialBodyFactory.getBody(name);

        this.name = name;
        this.mass = body.getGM() / PhysicsConstants.GRAVITATIONAL_CONSTANT;
        Double radiusValue = PhysicsConstants.RADIUS_MAP.get(name.toUpperCase());
        if (radiusValue == null) {
            throw new IllegalArgumentException("Unknown celestial body: " + name);
        }
        this.radius = radiusValue;
        this.position = body.getPVCoordinates(
                date,
                frame
        ).getPosition();
        this.velocity = body.getPVCoordinates(
                date,
                frame
        ).getVelocity();
    }
}

