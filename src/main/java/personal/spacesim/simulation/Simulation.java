package personal.spacesim.simulation;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.stream.Collectors;

@Service
public class Simulation {

    private static final Logger logger = LoggerFactory.getLogger(Simulation.class);

    private final FrameWrapper frameWrapper;
    private final List<CelestialBodyWrapper> celestialBodies;
    private final ObjectMapper objectMapper;
    private AbsoluteDate simStartDate = AbsoluteDate.J2000_EPOCH;
    private AbsoluteDate simCurrentDate = AbsoluteDate.J2000_EPOCH;
    private Integrator integrator;

    @Autowired
    public Simulation(FrameWrapper frameWrapper, Integrator integrator, ObjectMapper objectMapper) {
        this.frameWrapper = frameWrapper;
        this.celestialBodies = new ArrayList<>();
        this.integrator = integrator;
        this.objectMapper = objectMapper;
    }

    /**
     *
     * @param celestialBodyNames
     * @param date
     * @param frameWrapper
     * @return ObjectMapper containing String values of all CelestialBodies and their attributes
     */
    public String initializeSimulation(List<String> celestialBodyNames, AbsoluteDate date, FrameWrapper frameWrapper) {
        this.simStartDate = date;
        this.simCurrentDate = date;

        celestialBodies.clear();  // Clear existing bodies

        for (String bodyName : celestialBodyNames) {
            CelestialBodyWrapper body = new CelestialBodyWrapper(bodyName,
                                                                 frameWrapper.getCurrentFrame(),
                                                                 simStartDate);

            celestialBodies.add(body);
        }

        // Convert the list of celestial bodies to JSON
        try {
            return objectMapper.writeValueAsString(celestialBodies);
        } catch (Exception e) {
            e.printStackTrace();
            return "{}"; // Return an empty JSON object in case of error
        }
    }


    public void addCelestialBody(CelestialBodyWrapper body) {
        this.celestialBodies.add(body);
    }

    public List<CelestialBodyWrapper> getCelestialBodies() {
        return new ArrayList<>(celestialBodies);
    }

    public void setReferenceFrame(String frameName) {
        this.frameWrapper.setFrame(frameName);
    }

    public void setIntegrator(Integrator integrator) {
        this.integrator = integrator;
    }

    private Vector3D calculateGravitationalForce(CelestialBodyWrapper body1, CelestialBodyWrapper body2, AbsoluteDate date) {
        Vector3D position1 = body1.getPosition();
        Vector3D position2 = body2.getPosition();
        Vector3D r = position2.subtract(position1);
        double distance = r.getNorm();
        double forceMagnitude = Constants.GRAVITATIONAL_CONSTANT * body1.getMass() * body2.getMass() / (distance * distance);
        return r.normalize().scalarMultiply(forceMagnitude);
    }

    public void update(double deltaTime) {
        this.simCurrentDate = simCurrentDate.shiftedBy(deltaTime);

        for (CelestialBodyWrapper body : celestialBodies) {

            if (body.getName().equals("SUN")) {
                continue; // Skip the Sun
            }
            Vector3D totalForce = new Vector3D(0, 0, 0);
            for (CelestialBodyWrapper otherBody : celestialBodies) {

                if (!body.equals(otherBody)) {
                    totalForce = totalForce.add(calculateGravitationalForce(body, otherBody, simCurrentDate));
                }
            }
            integrator.update(body, totalForce, deltaTime, simCurrentDate, frameWrapper.getCurrentFrame());
        }

        logger.info("Updated positions and velocities for date: {}", simStartDate);
        for (CelestialBodyWrapper body : celestialBodies) {
            logger.info("{} Position: {}, Velocity: {}", body.getName(), body.getPosition(),
                        body.getVelocity());
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
        logger.info("Simulation ran using frame: {}", frameWrapper.getCurrentFrame().getName());
    }
}
