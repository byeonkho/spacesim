package personal.spacesim.dtos;

import lombok.Data;
import personal.spacesim.simulation.body.CelestialBodyWrapper;
import java.util.List;
import java.util.Map;

@Data
public class SimulationResponseDTO {
    private List<CelestialBodyWrapper> celestialBodyList;
    private Map<String, Double> radiusMap;
    private SimulationResponseMetadata simulationMetaData;

    public SimulationResponseDTO (List<CelestialBodyWrapper> celestialBodyList,
                                  Map<String, Double> radiusMap,
                                  SimulationResponseMetadata simulationResponseMetadata
                                 ) {
        this.celestialBodyList = celestialBodyList;
        this.radiusMap = radiusMap;
        this.simulationMetaData = simulationResponseMetadata;
    }
}