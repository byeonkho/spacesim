package personal.spacesim.dtos;

import lombok.Data;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.simulation.body.CelestialBodySnapshot;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class WebSocketResponseDTO {

    private Map<String, Map<AbsoluteDate, List<CelestialBodySnapshot>>> data;
    private String messageType = "SIM_DATA";

    // Constructor
    public WebSocketResponseDTO(Map<AbsoluteDate, List<CelestialBodySnapshot>> data) {
        this.data = new HashMap<>();
        this.data.put("data", data);
    }
}
