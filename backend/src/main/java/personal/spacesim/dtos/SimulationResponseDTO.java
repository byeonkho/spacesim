package personal.spacesim.dtos;

import lombok.Data;
import personal.spacesim.simulation.body.CelestialBodyWrapper;

import java.util.List;

@Data
public class SimulationResponseDTO {
    private List<CelestialBodyWrapper> celestialBodyWrapperList;
    private SimulationResponseMetadata simulationMetaData;

    public SimulationResponseDTO (List<CelestialBodyWrapper> celestialBodyWrapperList,
                                  SimulationResponseMetadata simulationResponseMetadata
                                 ) {
        this.celestialBodyWrapperList = celestialBodyWrapperList;
        this.simulationMetaData = simulationResponseMetadata;
    }
}