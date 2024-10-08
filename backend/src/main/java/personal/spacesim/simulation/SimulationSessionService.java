package personal.spacesim.simulation;

import org.orekit.time.AbsoluteDate;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;

import personal.spacesim.dtos.WebSocketResponseDTO;

import personal.spacesim.simulation.body.CelestialBodyWrapper;

import java.util.ArrayList;
import java.util.List;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SimulationSessionService {

    // TODO logic for memory management (max size of map)
    private final ConcurrentHashMap<String, Simulation> simulationMap;
    private final SimulationFactory simulationFactory;

    @Autowired
    public SimulationSessionService(SimulationFactory simulationFactory
    ) {
        this.simulationFactory = simulationFactory;
        this.simulationMap = new ConcurrentHashMap<>();
    }

    public Simulation createSimulation(
            List<String> celestialBodyNames,
            String frameStr,
            String integratorStr,
            AbsoluteDate simStartDate
    ) {
        String sessionID = UUID.randomUUID().toString();
        Simulation simulation = simulationFactory.createSimulation(
                sessionID,
                celestialBodyNames,
                frameStr,
                integratorStr,
                simStartDate
        );
        simulationMap.put(
                sessionID,
                simulation
        );
        return simulation;
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
            String sessionID,
            double totalTime,
            double deltaTime
    ) {
        Simulation simulation = getSimulation(sessionID);
        if (simulation != null) {
            try {
                return simulation.run(totalTime, deltaTime);
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