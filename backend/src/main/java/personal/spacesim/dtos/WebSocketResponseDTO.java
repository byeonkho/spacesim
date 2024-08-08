package personal.spacesim.dtos;

import personal.spacesim.simulation.body.CelestialBodySnapshot;

import java.util.List;
import java.util.Map;

public class WebSocketResponseDTO {

    private Map<WebSocketResponseKey, List<CelestialBodySnapshot>> results;

    // Constructor
    public WebSocketResponseDTO(Map<WebSocketResponseKey, List<CelestialBodySnapshot>> results) {
        this.results = results;
    }

    // Getter and Setter
    public Map<WebSocketResponseKey, List<CelestialBodySnapshot>> getResults() {
        return results;
    }

    public void setResults(Map<WebSocketResponseKey, List<CelestialBodySnapshot>> results) {
        this.results = results;
    }
}