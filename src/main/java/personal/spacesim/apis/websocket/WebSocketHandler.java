package personal.spacesim.apis.websocket;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.frames.Frame;
import org.orekit.frames.FramesFactory;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import personal.spacesim.services.interfaces.PlanetaryOperations;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final Map<String, PlanetaryOperations> celestialServices;
    private final ObjectMapper objectMapper;

    @Autowired
    public WebSocketHandler(Map<String, PlanetaryOperations> celestialServices, ObjectMapper objectMapper) {
        this.celestialServices = celestialServices;
        this.objectMapper = objectMapper;
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Map<String, String> payload = objectMapper.readValue(message.getPayload(), Map.class);
        String planetName = payload.get("planetName").toLowerCase();
        String dateStr = payload.get("dateStr");

        PlanetaryOperations service = celestialServices.get(planetName);
        if (service == null) {
            session.sendMessage(new TextMessage("Unsupported planet: " + planetName));
            return;
        }

        AbsoluteDate date = new AbsoluteDate(dateStr, TimeScalesFactory.getUTC());
        Frame frame = FramesFactory.getICRF();

        Vector3D position = service.getPosition(frame, date);
        Vector3D velocity = service.getVelocity(frame, date);

        Map<String, Vector3D> response = Map.of(
                "position", position,
                "velocity", velocity
        );

        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Connection established
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // Connection closed
    }
}