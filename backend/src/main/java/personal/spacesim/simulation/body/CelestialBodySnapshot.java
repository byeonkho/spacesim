package personal.spacesim.simulation.body;

import lombok.Data;
import org.hipparchus.geometry.euclidean.threed.Vector3D;

@Data
public class CelestialBodySnapshot {
    private String name;
    private Vector3D position;
    private Vector3D velocity;
}
