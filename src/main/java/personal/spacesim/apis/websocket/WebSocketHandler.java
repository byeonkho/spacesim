package personal.spacesim.apis.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.stereotype.Component;
import personal.spacesim.services.implementation.CelestialBodyWrapper;
import personal.spacesim.simulation.Simulation;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;

import java.util.List;
import java.util.Map;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final Simulation simulation;
    private final ObjectMapper objectMapper;

    @Autowired
    public WebSocketHandler(Simulation simulation, ObjectMapper objectMapper) {
        this.simulation = simulation;
        this.objectMapper = objectMapper;
    }

    // Payload consists of
    // 1. List<String> CelestialBodies
    // 2. date
    // 3. total time to run
    // 4. delta time (time step)

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            Map<String, Object> payload = objectMapper.readValue(message.getPayload(), Map.class);
            List<String> celestialBodies = (List<String>) payload.get("celestialBodies");
            String dateStr = (String) payload.get("dateStr");
            double totalTime = (double) payload.get("totalTime");
            double deltaTime = (double) payload.get("deltaTime");

            if (celestialBodies == null || dateStr == null) {
                session.sendMessage(new TextMessage("Invalid payload"));
                return;
            }

            AbsoluteDate date = new AbsoluteDate(dateStr, TimeScalesFactory.getUTC());
//            simulation.setReferenceFrame("ICRF"); // Example reference frame
//            simulation.initializeSimulation(celestialBodies, date, frameWrapper);

            simulation.run(totalTime, deltaTime);

            // Collect results
            List<CelestialBodyWrapper> results = simulation.getCelestialBodies();
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
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        System.out.println("WebSocket connection closed: " + session.getId() + " with status: " + status);
    }
}
