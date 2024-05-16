package personal.spacesim.entities;

import org.joml.Vector3d;

public class Moon extends CelestialBody {
    public Moon(
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
