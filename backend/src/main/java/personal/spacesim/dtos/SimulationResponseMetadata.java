package personal.spacesim.dtos;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class SimulationResponseMetadata {

    private String sessionID;

    public SimulationResponseMetadata(String sessionID) {
        this.sessionID = sessionID;
    }
}
