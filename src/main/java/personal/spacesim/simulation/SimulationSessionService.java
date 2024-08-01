package personal.spacesim.simulation;

import org.orekit.time.AbsoluteDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import personal.spacesim.simulation.body.CelestialBodyWrapper;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SimulationSessionService {

    private final ConcurrentHashMap<String, Simulation> simulationMap = new ConcurrentHashMap<>();
    private final SimulationFactory simulationFactory;

    @Autowired
    public SimulationSessionService(SimulationFactory simulationFactory) {
        this.simulationFactory = simulationFactory;
    }

    public List<CelestialBodyWrapper> createSimulation(
            List<String> celestialBodyNames,
            String frameStr,
            String integratorStr,
            AbsoluteDate simStartDate
    ) {
        String sessionID = UUID.randomUUID().toString();
        Simulation simulation = simulationFactory.createSimulation(
                celestialBodyNames,
                frameStr,
                integratorStr,
                simStartDate
        );
        simulationMap.put(
                sessionID,
                simulation
        );
        return simulation.getCelestialBodies();
    }

    public Simulation getSimulation(String sessionID) {
        return simulationMap.get(sessionID);
    }

    public void removeSimulation(String sessionID) {
        simulationMap.remove(sessionID);
    }

    public void runSimulation(
            String sessionID,
            double totalTime,
            double deltaTime
    ) {
        Simulation simulation = getSimulation(sessionID);
        if (simulation != null) {
            simulation.run(
                    totalTime,
                    deltaTime
            );
        }
    }

    public void updateSimulation(
            String sessionID,
            double deltaTime
    ) {
        Simulation simulation = getSimulation(sessionID);
        if (simulation != null) {
            simulation.update(deltaTime);
        }
    }

    public List<CelestialBodyWrapper> getSimulationResults(String sessionID) {
        Simulation simulation = getSimulation(sessionID);
        return simulation != null ? simulation.getCelestialBodies() : new ArrayList<>();
    }
}