package personal.spacesim.services;

import org.orekit.time.AbsoluteDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import personal.spacesim.dtos.SimulationResponseDTO;
import personal.spacesim.dtos.SimulationResponseMetadata;
import personal.spacesim.dtos.WebSocketResponseDTO;
import personal.spacesim.simulation.Simulation;
import personal.spacesim.simulation.SimulationFactory;
import personal.spacesim.simulation.body.CelestialBodyWrapper;
import personal.spacesim.utils.serializers.WebSocketResponseSizeSerializer;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SimulationSessionService {

    private final Logger logger = LoggerFactory.getLogger(SimulationSessionService.class);

    // TODO logic for memory management (max size of map)
    private final ConcurrentHashMap<String, Simulation> simulationMap;
    private final SimulationFactory simulationFactory;
    private final WebSocketResponseSizeSerializer webSocketResponseSizeSerializer;

    @Autowired
    public SimulationSessionService(SimulationFactory simulationFactory,
                                    WebSocketResponseSizeSerializer webSocketResponseSizeSerializer
    ) {
        this.simulationFactory = simulationFactory;
        this.simulationMap = new ConcurrentHashMap<>();
        this.webSocketResponseSizeSerializer = webSocketResponseSizeSerializer;
    }

    public String createSimulation(
            List<String> celestialBodyNames,
            String frame,
            String integrator,
            AbsoluteDate simStartDate,
            String timeStep
    ) {
        String sessionID = UUID.randomUUID().toString();
        Simulation simulation = simulationFactory.createSimulation(
                sessionID,
                celestialBodyNames,
                frame,
                integrator,
                simStartDate,
                timeStep,
                webSocketResponseSizeSerializer
        );
        simulationMap.put(
                sessionID,
                simulation
        );
        logger.info(
                "sessionID: {}",
                sessionID
        );
        return sessionID;
    }

    public SimulationResponseDTO returnSimulationResponseDTO(String sessionID) {
        Simulation simulation = simulationMap.get(sessionID);
        List<CelestialBodyWrapper> celestialBodyList = simulation.getCelestialBodies();
        SimulationResponseMetadata simulationResponseMetadata = new SimulationResponseMetadata(sessionID);
        // Construct and return the response DTO
        return new SimulationResponseDTO(
                celestialBodyList,
                simulationResponseMetadata
        );
    }

    public Simulation getSimulation(String sessionID) {
        return simulationMap.get(sessionID);
    }

    public List<Simulation> getAllSimulations() {
        return new ArrayList<>(simulationMap.values());
    }

    public void removeSimulation(String sessionID) {
        simulationMap.remove(sessionID);
    }

    public WebSocketResponseDTO runSimulation(
            String sessionID
    ) {
        Simulation simulation = getSimulation(sessionID);
        if (simulation != null) {
            try {
                return simulation.run();
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Error running simulation", e);
            }
        } else {
            throw new IllegalArgumentException("Simulation not found for session ID: " + sessionID);
        }
    }

    public List<CelestialBodyWrapper> getSimulationResults(String sessionID) {
        Simulation simulation = getSimulation(sessionID);
        return simulation != null ? simulation.getCelestialBodies() : new ArrayList<>();
    }
}