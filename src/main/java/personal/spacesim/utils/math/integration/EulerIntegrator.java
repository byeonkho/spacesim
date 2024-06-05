package personal.spacesim.utils.math.integration;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.services.implementation.CelestialBodyWrapper;

public class EulerIntegrator implements Integrator {
    @Override
    public void update(CelestialBodyWrapper body,
                       Vector3D totalForce,
                       double deltaTime,
                       AbsoluteDate currentDate,
                       Frame frame) {

        double mass = body.getMass();
        Vector3D acceleration = totalForce.scalarMultiply(1.0 / mass);
        Vector3D newVelocity = body.getCurrentVelocity().add(acceleration.scalarMultiply(deltaTime));
        Vector3D newPosition = body.getCurrentPosition().add(newVelocity.scalarMultiply(deltaTime));

        body.setPosition(newPosition);
        body.setVelocity(newVelocity);
    }
}
