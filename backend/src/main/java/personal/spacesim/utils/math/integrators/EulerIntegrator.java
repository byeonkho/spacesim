package personal.spacesim.utils.math.integrators;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.simulation.body.CelestialBodyWrapper;

public class EulerIntegrator implements Integrator {

    @Override
    public void update(CelestialBodyWrapper body,
                       Vector3D totalForce,
                       double deltaTimeSeconds,
                       AbsoluteDate currentDate,
                       Frame frame) {
        double mass = body.getMass();
        Vector3D acceleration = totalForce.scalarMultiply(1.0 / mass);

        Vector3D newVelocity = body.getVelocity().add(acceleration.scalarMultiply(deltaTimeSeconds));
        Vector3D newPosition = body.getPosition().add(newVelocity.scalarMultiply(deltaTimeSeconds));

        body.setPosition(newPosition);
        body.setVelocity(newVelocity);
    }
}
