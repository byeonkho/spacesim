package personal.spacesim.dtos;

import personal.spacesim.simulation.body.CelestialBodyWrapper;

import java.util.ArrayList;
import java.util.List;

public class SimulationResponseDTO {

    private List<CelestialBodyWrapper> celestialBodyList;
    private String sessionID;


    private List<SimulationResponseMetadata> celestialBodyMetadata;

    public SimulationResponseDTO (List<CelestialBodyWrapper> celestialBodyList, String sessionID, List<SimulationResponseMetadata> celestialBodyMetadata) {
        this.celestialBodyList = celestialBodyList;
        this.sessionID = sessionID;
        this.celestialBodyMetadata = celestialBodyMetadata;
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

    public List<SimulationResponseMetadata> getMetadataList() {
        return celestialBodyMetadata;
    }

    public void setMetadataList(List<SimulationResponseMetadata> celestialBodyMetadata) {
        this.celestialBodyMetadata = celestialBodyMetadata;
    }

}