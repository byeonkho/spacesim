package personal.spacesim.apis.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.orekit.time.AbsoluteDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.stereotype.Component;
import personal.spacesim.dtos.WebsocketRequestDTO;
import personal.spacesim.simulation.body.CelestialBodyWrapper;
import personal.spacesim.simulation.SimulationSessionService;

import java.util.List;
import java.util.Map;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final SimulationSessionService simulationSessionService;
    private final ObjectMapper objectMapper;

    @Autowired
    public WebSocketHandler(
            SimulationSessionService simulationSessionService,
            ObjectMapper objectMapper
    ) {
        this.simulationSessionService = simulationSessionService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void handleTextMessage(
            WebSocketSession session,
            TextMessage message
    ) throws Exception {
        try {
            WebsocketRequestDTO request = objectMapper.readValue(
                    message.getPayload(),
                    WebsocketRequestDTO.class
            );

            String sessionID = request.getSessionID();
            double totalTime = request.getTotalTime();
            double deltaTime = request.getDeltaTime();

            if (sessionID == null || totalTime <= 0 || deltaTime <= 0) {
                session.sendMessage(new TextMessage(    "Invalid payload"));
                return;
            }

            Map<AbsoluteDate, List<CelestialBodyWrapper>> results = simulationSessionService.runSimulation(
                    sessionID,
                    totalTime,
                    deltaTime
            );

            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(results)));
        } catch (Exception e) {
            e.printStackTrace();
            session.sendMessage(new TextMessage("Error processing request"));
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("WebSocket connection established: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status
    ) {
        System.out.println("WebSocket connection closed: " + session.getId() + " with status: " + status);
        simulationSessionService.removeSimulation(session.getId());
    }
}