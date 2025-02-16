package personal.spacesim.dtos;

import lombok.Data;
import personal.spacesim.simulation.body.CelestialBodyWrapper;

import java.util.List;

@Data
public class SimulationResponseDTO {
    private List<CelestialBodyWrapper> celestialBodyPropertiesList;
    private SimulationResponseMetadata simulationMetaData;

    public SimulationResponseDTO (List<CelestialBodyWrapper> celestialBodyPropertiesList,
                                  SimulationResponseMetadata simulationResponseMetadata
                                 ) {
        this.celestialBodyPropertiesList = celestialBodyPropertiesList;
        this.simulationMetaData = simulationResponseMetadata;
    }
}