package personal.spacesim.dtos;

import personal.spacesim.simulation.body.CelestialBodySnapshot;

import java.util.List;
import java.util.Map;

public class WebSocketResponseDTO {

    private Map<WebSocketMetaData, List<CelestialBodySnapshot>> results;

    // Constructor
    public WebSocketResponseDTO(Map<WebSocketMetaData, List<CelestialBodySnapshot>> results) {
        this.results = results;
    }

    // Getter and Setter
    public Map<WebSocketMetaData, List<CelestialBodySnapshot>> getResults() {
        return results;
    }

    public void setResults(Map<WebSocketMetaData, List<CelestialBodySnapshot>> results) {
        this.results = results;
    }
}