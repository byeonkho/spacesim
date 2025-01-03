    package personal.spacesim.simulation;

    import lombok.Getter;
    import lombok.Setter;
    import org.hipparchus.geometry.euclidean.threed.Vector3D;
    import org.orekit.frames.Frame;
    import org.orekit.time.AbsoluteDate;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import personal.spacesim.constants.PhysicsConstants;
    import personal.spacesim.dtos.WebSocketResponseDTO;
    import personal.spacesim.simulation.body.CelestialBodySnapshot;
    import personal.spacesim.simulation.body.CelestialBodyWrapper;
    import personal.spacesim.utils.math.functions.Gravity;
    import personal.spacesim.utils.math.integrators.Integrator;

    import java.util.ArrayList;
    import java.util.LinkedHashMap;
    import java.util.List;
    import java.util.Map;

    @Getter
    @Setter
    public class Simulation {

        private final Logger logger = LoggerFactory.getLogger(Simulation.class);

        private final String sessionID;
        private Frame frame;
        private List<CelestialBodyWrapper> celestialBodies;
        private AbsoluteDate simStartDate;
        private AbsoluteDate simCurrentDate;
        private Integrator integrator;
        private String timeStepUnit;
        private static final int TIMESTEPS_TO_RUN = 10000;

        public Simulation(
                String sessionID,
                List<CelestialBodyWrapper> celestialBodies,
                Frame frame,
                Integrator integrator,
                AbsoluteDate simStartDate,
                String timeStepUnit
                ) {
            this.sessionID = sessionID;
            this.frame = frame;
            this.celestialBodies = celestialBodies;
            this.integrator = integrator;
            this.simStartDate = simStartDate;
            this.simCurrentDate = simStartDate;
            this.timeStepUnit = timeStepUnit;
        }

        private void update() {
            double deltaTimeSeconds = convertTimeStep(timeStepUnit);

            simCurrentDate = simCurrentDate.shiftedBy(deltaTimeSeconds);

            for (CelestialBodyWrapper body : celestialBodies) {
                if (body.getName().equals("SUN")) {
                    continue; // Skip the Sun for simplicity. // TODO future refactor for more accurate modelling?
                }
                Vector3D totalForce = new Vector3D(0, 0, 0);
                for (CelestialBodyWrapper otherBody : celestialBodies) {
                    if (!body.equals(otherBody)) {
                        totalForce = totalForce.add(Gravity.calculateGravitationalForce(body, otherBody));
                    }
                }

                // mutates the state (pos, vel) of all objects in the celestialBodies array
                integrator.update(body, totalForce, deltaTimeSeconds, simCurrentDate, frame);
            }

//            logger.info("Updated positions and velocities for date: {}", simCurrentDate);
//            for (CelestialBodyWrapper body : celestialBodies) {
//                logger.info("{} Position: {}, Velocity: {}", body.getName(), body.getPosition(),
//                            body.getVelocity());
//            }
        }

        public WebSocketResponseDTO run() {
            long startTime = System.nanoTime();
            int currentTimeStep = 0;
            Map<AbsoluteDate, List<CelestialBodySnapshot>> results = new LinkedHashMap<>();

            while (currentTimeStep < TIMESTEPS_TO_RUN) {
                // First iteration
                if (currentTimeStep == 0) {
                    results.put(simStartDate, snapshotCelestialBodies(celestialBodies));
                } else {
                    update();
                    results.put(simCurrentDate, snapshotCelestialBodies(celestialBodies));
                }
                currentTimeStep ++;
                logger.info("Simulation iteration: {} ", currentTimeStep);
            }

            long endTime = System.nanoTime();
            double totalTimeSeconds = (endTime - startTime) / 1_000_000_000.0;

            logger.info("Simulation completed for {} {} in {} seconds.", TIMESTEPS_TO_RUN, timeStepUnit,
                        totalTimeSeconds);
            logger.info("Simulation ran using frame: {}", frame.getName());

            WebSocketResponseDTO responsePayload = new WebSocketResponseDTO();
            responsePayload.setData(results);
            return responsePayload;
        }

        private List<CelestialBodySnapshot> snapshotCelestialBodies(List<CelestialBodyWrapper> originalList) {
            List<CelestialBodySnapshot> copy = new ArrayList<>();
            for (CelestialBodyWrapper body : originalList) {
                CelestialBodySnapshot snapshot = new CelestialBodySnapshot();
                snapshot.setPosition(body.getPosition());
                snapshot.setVelocity(body.getVelocity());
                snapshot.setName(body.getName());
                snapshot.setRadius(body.getRadius());
                copy.add(snapshot);
            }
            return copy;
        }

        private double convertTimeStep(String timeStepUnit) {
            switch (timeStepUnit.toLowerCase()) {
                case "seconds":
                    return 1;
                case "hours":
                    return PhysicsConstants.SECONDS_PER_HOUR;
                case "days":
                    return PhysicsConstants.SECONDS_PER_DAY;
                case "weeks":
                    return PhysicsConstants.SECONDS_PER_WEEK;
                default:
                    throw new IllegalArgumentException("Unsupported time step unit: " + timeStepUnit);
            }
        }
    }
