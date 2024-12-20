package personal.spacesim.dtos;

import lombok.Data;

@Data
public class SimulationResponseMetadata {

    private String sessionID;

    public SimulationResponseMetadata(String sessionID) {
        this.sessionID = sessionID;
    }
}
