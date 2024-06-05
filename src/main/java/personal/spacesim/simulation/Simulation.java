package personal.spacesim.simulation;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.time.AbsoluteDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import personal.spacesim.utils.math.integration.Integrator;
import personal.spacesim.services.implementation.CelestialBodyWrapper;
import personal.spacesim.utils.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

@Service
public class Simulation {

    private static final Logger logger = LoggerFactory.getLogger(Simulation.class);

    private final FrameContext frameContext;
    private final List<CelestialBodyWrapper> celestialBodies;
    private AbsoluteDate currentDate;
    private Integrator integrator;

    @Autowired
    public Simulation(FrameContext frameContext, Integrator integrator) {
        this.frameContext = frameContext;
        this.celestialBodies = new ArrayList<>();
        this.currentDate = AbsoluteDate.J2000_EPOCH;
        this.integrator = integrator;
    }

    public void addCelestialBody(CelestialBodyWrapper body) {
        this.celestialBodies.add(body);
    }

    public List<CelestialBodyWrapper> getCelestialBodies() {
        return new ArrayList<>(celestialBodies);
    }

    public void setReferenceFrame(String frameName) {
        this.frameContext.setFrame(frameName);
    }

    public void setIntegrator(Integrator integrator) {
        this.integrator = integrator;
    }

    private Vector3D calculateGravitationalForce(CelestialBodyWrapper body1, CelestialBodyWrapper body2, AbsoluteDate date) {
        Vector3D position1 = body1.getCurrentPosition();
        Vector3D position2 = body2.getCurrentPosition();
        Vector3D r = position2.subtract(position1);
        double distance = r.getNorm();
        double forceMagnitude = Constants.GRAVITATIONAL_CONSTANT * body1.getMass() * body2.getMass() / (distance * distance);
        return r.normalize().scalarMultiply(forceMagnitude);
    }

    public void update(double deltaTime) {
        this.currentDate = currentDate.shiftedBy(deltaTime);

        for (CelestialBodyWrapper body : celestialBodies) {

            if (body.getName().equals("Sun")) {
                continue; // Skip the Sun
            }
            Vector3D totalForce = new Vector3D(0, 0, 0);
            for (CelestialBodyWrapper otherBody : celestialBodies) {

                if (!body.equals(otherBody)) {
                    totalForce = totalForce.add(calculateGravitationalForce(body, otherBody, currentDate));
                }
            }
            integrator.update(body, totalForce, deltaTime, currentDate, frameContext.getCurrentFrame());
        }

        logger.info("Updated positions and velocities for date: {}", currentDate);
        for (CelestialBodyWrapper body : celestialBodies) {
            logger.info("{} Position: {}, Velocity: {}", body.getName(), body.getCurrentPosition(), body.getCurrentVelocity());
        }
    }

    public void run(double totalTime, double deltaTime) {
        double currentTime = 0;
        while (currentTime < totalTime) {
            update(deltaTime);
            currentTime += deltaTime;
            logger.info("Simulation time: {} seconds", currentTime);
        }
        logger.info("Simulation completed for total time: {} seconds", totalTime);
    }
}
