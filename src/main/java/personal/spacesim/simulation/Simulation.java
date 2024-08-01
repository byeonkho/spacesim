    package personal.spacesim.simulation;

    import com.fasterxml.jackson.databind.ObjectMapper;
    import org.hipparchus.geometry.euclidean.threed.Vector3D;
    import org.orekit.frames.Frame;
    import org.orekit.time.AbsoluteDate;
    import personal.spacesim.utils.math.functions.Gravity;
    import personal.spacesim.utils.math.integrators.Integrator;
    import personal.spacesim.simulation.body.CelestialBodyWrapper;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;

    import java.util.ArrayList;
    import java.util.List;

    public class Simulation {

        private final Logger logger = LoggerFactory.getLogger(Simulation.class);

        private final String sessionID;
        private Frame frame;
        private List<CelestialBodyWrapper> celestialBodies;
        private AbsoluteDate simStartDate;
        private AbsoluteDate simCurrentDate;
        private Integrator integrator;

        public Simulation(
                String sessionID,
                List<CelestialBodyWrapper> celestialBodies,
                Frame frame,
                Integrator integrator,
                AbsoluteDate simStartDate) {

            this.sessionID = sessionID;
            this.frame = frame;
            this.celestialBodies = celestialBodies;
            this.integrator = integrator;
            this.simStartDate = simStartDate;
            this.simCurrentDate = simStartDate;
        }

        public void addCelestialBody(CelestialBodyWrapper body) {
            this.celestialBodies.add(body);
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
                        totalForce = totalForce.add(Gravity.calculateGravitationalForce(body, otherBody, simCurrentDate));
                    }
                }
                integrator.update(body, totalForce, deltaTime, simCurrentDate, frame);
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
            logger.info("Simulation ran using frame: {}", frame.getName());
        }

        // Getters and setters
        public String getSessionID() {
            return sessionID;
        }

        public List<CelestialBodyWrapper> getCelestialBodies() {
            return new ArrayList<>(celestialBodies);
        }

        public void setReferenceFrame(Frame frame) {
            this.frame = frame;
        }

        public void setIntegrator(Integrator integrator) {
            this.integrator = integrator;
        }
    }
