package personal.spacesim.dtos;

import personal.spacesim.simulation.body.CelestialBodySnapshot;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.HashMap;

public class WebSocketResponseDTO {

    private Map<String, Map<WebSocketResponseKey, List<CelestialBodySnapshot>>> data;
    private String messageType = "SIM_DATA";

    // Constructor
    public WebSocketResponseDTO(Map<WebSocketResponseKey, List<CelestialBodySnapshot>> data) {
        this.data = new HashMap<>();
        this.data.put("data", data);
    }

    // Getter and Setter
    public Map<String, Map<WebSocketResponseKey, List<CelestialBodySnapshot>>> getData() {
        return data;
    }

    public void setData(Map<String, Map<WebSocketResponseKey, List<CelestialBodySnapshot>>> data) {
        this.data = data;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }
}