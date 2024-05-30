package personal.spacesim.services.interfaces;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;

public interface GenericPlanetaryOperations extends PlanetaryOperations {
    Vector3D getPosition(
            String planetName,
            Frame frame,
            AbsoluteDate date
    );

    Vector3D getVelocity(
            String planetName,
            Frame frame,
            AbsoluteDate date
    );

    @Override
    default Vector3D getPosition(
            Frame frame,
            AbsoluteDate date
    ) {
        // Default implementation or throw UnsupportedOperationException
        throw new UnsupportedOperationException("Use getPosition(String planetName, Frame frame, AbsoluteDate date)");
    }

    @Override
    default Vector3D getVelocity(Frame frame, AbsoluteDate date) {
        // Default implementation or throw UnsupportedOperationException
        throw new UnsupportedOperationException("Use getVelocity(String planetName, Frame frame, AbsoluteDate date)");
    }
}
