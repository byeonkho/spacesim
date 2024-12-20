package personal.spacesim.dtos;

import lombok.Data;

@Data
public class WebsocketRequestDTO {
    private double totalTime;
    private double deltaTime;
    private String sessionID;
}