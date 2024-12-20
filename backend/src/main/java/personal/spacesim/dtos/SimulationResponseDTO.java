package personal.spacesim.dtos;

import lombok.Data;
import personal.spacesim.simulation.body.CelestialBodyWrapper;

import java.util.List;

@Data
public class SimulationResponseDTO {
    private List<CelestialBodyWrapper> celestialBodyList;

    private SimulationResponseMetadata simulationMetadata;

    public SimulationResponseDTO (List<CelestialBodyWrapper> celestialBodyList,
                                  SimulationResponseMetadata celestialBodyMetadata) {
        this.celestialBodyList = celestialBodyList;
        this.simulationMetadata = celestialBodyMetadata;
    }
}