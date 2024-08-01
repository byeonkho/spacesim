package personal.spacesim.dtos;

import personal.spacesim.simulation.body.CelestialBodyWrapper;

import java.util.List;

public class SimulationResponseDTO {

    private List<CelestialBodyWrapper> celestialBodyList;
    private String sessionID;

    public SimulationResponseDTO (List<CelestialBodyWrapper> celestialBodyList, String sessionID) {
        this.celestialBodyList = celestialBodyList;
        this.sessionID = sessionID;
    }

    public List<CelestialBodyWrapper> getCelestialBodyList() {
        return celestialBodyList;
    }

    public String getSessionID() {
        return sessionID;
    }

    public void setSessionID(String sessionID) {
        this.sessionID = sessionID;

    }
    public void setCelestialBodyList(List<CelestialBodyWrapper> celestialBodyList) {
        this.celestialBodyList = celestialBodyList;
    }


}