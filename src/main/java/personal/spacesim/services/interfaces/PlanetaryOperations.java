package personal.spacesim.services.interfaces;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;

public interface PlanetaryOperations {
    Vector3D getPosition(
            Frame frame,
            AbsoluteDate date
    );

    Vector3D getVelocity(
            Frame frame,
            AbsoluteDate date
    );
}
