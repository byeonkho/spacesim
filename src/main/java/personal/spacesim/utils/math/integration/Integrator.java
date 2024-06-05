package personal.spacesim.utils.math.integration;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.services.implementation.CelestialBodyWrapper;

public interface Integrator {
    void update(CelestialBodyWrapper body,
                Vector3D totalForce,
                double deltaTime,
                AbsoluteDate currentDate,
                Frame frame);
}