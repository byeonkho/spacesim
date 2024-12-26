package personal.spacesim.utils.math.integrators;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.constants.PhysicsConstants;
import personal.spacesim.simulation.body.CelestialBodyWrapper;

public interface Integrator {
    void update(
            CelestialBodyWrapper body,
            Vector3D totalForce,
            double deltaTimeSeconds,
            AbsoluteDate currentDate,
            Frame frame);
}
