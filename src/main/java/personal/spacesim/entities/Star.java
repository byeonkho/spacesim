package personal.spacesim.entities;

import org.joml.Vector3d;

public class Star extends CelestialBody {
    public Star(
            int id,
            String name,
            double mass,
            double radius,
            Vector3d position,
            Vector3d velocity
    ) {
        super(
                id,
                name,
                mass,
                radius,
                position,
                velocity
        );
    }
}
