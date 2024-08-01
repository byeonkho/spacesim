package personal.spacesim.dtos;

import personal.spacesim.simulation.body.CelestialBodyWrapper;

import java.util.List;

public class SimulationResponseDTO {

    private List<CelestialBodyWrapper> celestialBodyList;

    public List<CelestialBodyWrapper> getCelestialBodyList() {
        return celestialBodyList;
    }

    public void setCelestialBodyList(List<CelestialBodyWrapper> celestialBodyList) {
        this.celestialBodyList = celestialBodyList;
    }

    public SimulationResponseDTO (List<CelestialBodyWrapper> celestialBodyList) {
        this.celestialBodyList = celestialBodyList;
    }

}