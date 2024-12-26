package personal.spacesim.dtos;

import lombok.Data;
import personal.spacesim.simulation.body.CelestialBodyWrapper;
import java.util.List;
import java.util.Map;

@Data
public class SimulationResponseDTO {
    private List<CelestialBodyWrapper> celestialBodyList;
    private SimulationResponseMetadata simulationMetaData;

    public SimulationResponseDTO (List<CelestialBodyWrapper> celestialBodyList,
                                  SimulationResponseMetadata simulationResponseMetadata
                                 ) {
        this.celestialBodyList = celestialBodyList;
        this.simulationMetaData = simulationResponseMetadata;
    }
}