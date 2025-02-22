package personal.spacesim.utils.math.integrators;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.hipparchus.ode.ODEIntegrator;
import org.hipparchus.ode.nonstiff.DormandPrince853Integrator;
import org.orekit.frames.Frame;
import org.orekit.orbits.CartesianOrbit;
import org.orekit.orbits.Orbit;
import org.orekit.orbits.OrbitType;
import org.orekit.propagation.SpacecraftState;
import org.orekit.propagation.numerical.NumericalPropagator;
import org.orekit.time.AbsoluteDate;
import org.orekit.utils.PVCoordinates;
import personal.spacesim.constants.PhysicsConstants;
import personal.spacesim.simulation.body.CelestialBodyWrapper;

public class RungeKuttaIntegrator implements Integrator {

    @Override
    public void update(CelestialBodyWrapper body,
                       Vector3D totalForce,
                       double deltaTimeSeconds,
                       AbsoluteDate currentDate,
                       Frame frame) {

        double minStep = 0.001;
        double maxStep = 1000.0;
        double[] vecAbsoluteTolerance = {1.0e-10, 1.0e-10, 1.0e-10};
        double[] vecRelativeTolerance = {1.0e-10, 1.0e-10, 1.0e-10};

        ODEIntegrator integrator = new DormandPrince853Integrator(minStep,
                                                                  maxStep,
                                                                  vecAbsoluteTolerance,
                                                                  vecRelativeTolerance);

        NumericalPropagator propagator = new NumericalPropagator(integrator);
        propagator.setOrbitType(OrbitType.CARTESIAN);

        PVCoordinates initialPV = new PVCoordinates(body.getPosition(), body.getVelocity());
        double gravitationalParameter = body.getMass() * PhysicsConstants.GRAVITATIONAL_CONSTANT;
        Orbit initialOrbit = new CartesianOrbit(initialPV, frame, currentDate, gravitationalParameter);
        propagator.setInitialState(new SpacecraftState(initialOrbit));

        SpacecraftState finalState = propagator.propagate(currentDate.shiftedBy(deltaTimeSeconds));
        PVCoordinates finalPV = finalState.getPVCoordinates();

        body.setPosition(finalPV.getPosition());
        body.setVelocity(finalPV.getVelocity());
    }
}
