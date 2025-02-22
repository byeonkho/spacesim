package personal.spacesim.utils.math.integrators;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.simulation.body.CelestialBodySnapshot;
import personal.spacesim.simulation.body.CelestialBodyWrapper;

public class EulerIntegrator implements Integrator {

  @Override
  public void update(
      CelestialBodyWrapper body,
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

  @Override
  public CelestialBodySnapshot getDelta(
      CelestialBodyWrapper body,
      Vector3D totalForce,
      double deltaTimeSeconds,
      AbsoluteDate currentDate,
      Frame frame) {

    double mass = body.getMass();
    Vector3D acceleration = totalForce.scalarMultiply(1.0 / mass);

    Vector3D oldVelocity = body.getVelocity();
    Vector3D oldPosition = body.getPosition();
    Vector3D newVelocity = body.getVelocity().add(acceleration.scalarMultiply(deltaTimeSeconds));
    Vector3D newPosition = oldPosition // improved Euler method
            .add(oldVelocity.scalarMultiply(deltaTimeSeconds))
            .add(acceleration.scalarMultiply(0.5 * deltaTimeSeconds * deltaTimeSeconds));

    // mutate the body in-place by updating to latest time step
    body.setPosition(newPosition);
    body.setVelocity(newVelocity);

    Vector3D deltaVelocity = newVelocity.subtract(oldVelocity);
    Vector3D deltaPosition = newPosition.subtract(oldPosition);

    // calculate the delta and return the snapshot
    CelestialBodySnapshot deltaSnapshot = new CelestialBodySnapshot();

    deltaSnapshot.setName(body.getName());
    deltaSnapshot.setVelocity(deltaVelocity);
    deltaSnapshot.setPosition(deltaPosition);

    return deltaSnapshot;
  }
}
