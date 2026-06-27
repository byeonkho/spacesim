package personal.spacesim.simulation;

import org.hipparchus.ode.ODEState;
import org.hipparchus.ode.OrdinaryDifferentialEquation;
import org.hipparchus.ode.nonstiff.DormandPrince853Integrator;
import org.hipparchus.ode.sampling.ODEStepHandler;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Pins DP853's derivative-evaluation cost per accepted step against the
 * Hipparchus build actually on the classpath. {@link Simulation}'s chunk
 * accept-rate telemetry divides the per-chunk evaluation total by
 * {@link Simulation#DP853_EVALS_PER_ACCEPTED_STEP}; if a Hipparchus upgrade
 * changes DP853's stage/dense-output evaluation count, the accept rate
 * drifts silently. This test fails loudly instead.
 *
 * <p>Measured by differencing two integrate() calls over a linear ODE
 * (y' = 1, integrated exactly by an 8th-order method so the adaptive
 * controller never rejects a step). Differencing cancels the fixed
 * per-call initialization evaluations, isolating the per-accepted-step
 * cost. Interpolation is requested on every step so the dense-output
 * stages evaluate, matching the production substep-handler path.
 */
final class DP853StageCountTest {

    // Match DP853Integrator's configuration so we measure the same method.
    private static final double MIN_STEP = 1.0;
    private static final double MAX_STEP = 86_400.0;
    private static final double ABS_TOL  = 1.0e-3;
    private static final double REL_TOL  = 1.0e-12;

    /** y' = 1: linear solution, integrated exactly by DP853 -> zero rejected steps. */
    private static final OrdinaryDifferentialEquation LINEAR =
            new OrdinaryDifferentialEquation() {
                @Override public int getDimension() { return 1; }
                @Override public double[] computeDerivatives(double t, double[] y) {
                    return new double[] { 1.0 };
                }
            };

    /** One integrate() over dt, interpolating each accepted step. Returns {evals, acceptedSteps}. */
    private long[] measure(double dt) {
        DormandPrince853Integrator integ =
                new DormandPrince853Integrator(MIN_STEP, MAX_STEP, ABS_TOL, REL_TOL);
        long[] acceptedSteps = { 0 };
        integ.addStepHandler((ODEStepHandler) interpolator -> {
            acceptedSteps[0]++;
            // Force dense-output stage evaluation, as production does.
            interpolator.getInterpolatedState(interpolator.getCurrentState().getTime());
        });
        integ.integrate(LINEAR, new ODEState(0.0, new double[] { 0.0 }), dt);
        return new long[] { integ.getEvaluations(), acceptedSteps[0] };
    }

    @Test
    void evalsPerAcceptedStepMatchesTelemetryConstant() {
        long[] shortRun = measure(3 * MAX_STEP);
        long[] longRun  = measure(13 * MAX_STEP);

        long deltaEvals = longRun[0] - shortRun[0];
        long deltaSteps = longRun[1] - shortRun[1];
        assertTrue(deltaSteps > 0 && deltaEvals % deltaSteps == 0,
                "expected a positive integer evals-per-step; deltaEvals=" + deltaEvals
                        + " deltaSteps=" + deltaSteps);

        long measured = deltaEvals / deltaSteps;
        assertEquals((long) Simulation.DP853_EVALS_PER_ACCEPTED_STEP, measured,
                "DP853 evals per accepted step changed under this Hipparchus build. "
                        + "Update Simulation.DP853_EVALS_PER_ACCEPTED_STEP (and the "
                        + "synthetic expectations in SimulationTelemetryTest) to "
                        + measured + ". deltaEvals=" + deltaEvals
                        + " deltaSteps=" + deltaSteps);
    }
}
