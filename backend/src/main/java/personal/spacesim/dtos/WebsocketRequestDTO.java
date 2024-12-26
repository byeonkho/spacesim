package personal.spacesim.dtos;

import lombok.Data;
import lombok.Getter;

@Getter
public class WebsocketRequestDTO {
    private String timeStep;
    private String sessionID;
}