package personal.spacesim.utils.math.functions;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.simulation.body.CelestialBodyWrapper;
import personal.spacesim.utils.Constants;

public class Gravity {
    public static Vector3D calculateGravitationalForce(CelestialBodyWrapper body1, CelestialBodyWrapper body2,
                                             AbsoluteDate date) {
        Vector3D position1 = body1.getPosition();
        Vector3D position2 = body2.getPosition();
        Vector3D r = position2.subtract(position1);
        double distance = r.getNorm();
        double forceMagnitude = Constants.GRAVITATIONAL_CONSTANT * body1.getMass() * body2.getMass() / (distance * distance);
        return r.normalize().scalarMultiply(forceMagnitude);
    }

}
