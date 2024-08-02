package personal.spacesim.apis.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.orekit.time.AbsoluteDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.stereotype.Component;
import personal.spacesim.dtos.WebSocketMetaData;
import personal.spacesim.dtos.WebSocketResponseDTO;
import personal.spacesim.dtos.WebsocketRequestDTO;
import personal.spacesim.simulation.body.CelestialBodySnapshot;
import personal.spacesim.simulation.body.CelestialBodyWrapper;
import personal.spacesim.simulation.SimulationSessionService;

@Component
public class WebSocketHandler extends TextWebSocketHandler {


    private final SimulationSessionService simulationSessionService;
    private final ObjectMapper objectMapper;


    // TODO fill this up
    /**
     *
     * @param simulationSessionService
     * @param objectMapper
     */
    @Autowired
    public WebSocketHandler(
            SimulationSessionService simulationSessionService,
            ObjectMapper objectMapper
    ) {
        this.simulationSessionService = simulationSessionService;
        this.objectMapper = objectMapper;
    }

    /**
     * The websocket currently handles a single responsibility: to receive the command parameters and run
     * the respective simulation.
     *
     * @param session JSON response payload is a LinkedHashMap with keys of type {@link WebSocketMetaData} and values of
     *                type ArrayList of {@link CelestialBodySnapshot}. Each key-value pair encapsulates the information
     *                required for the frontend to render the simulation at each time step, namely:
     *                <ul>
     *                  <li>timestamp</li>
     *                  <li>position and velocity of each celestial body</li>
     *                </ul>
     *                {@link CelestialBodySnapshot} is a stripped-down copy of {@link CelestialBodyWrapper} that holds only the
     *                salient attributes required for the frontend.
     *
     * @param message JSON request payload {@link WebsocketRequestDTO} consists of:
     *                <ul>
     *                  <li>sessionID</li>
     *                  <li>time delta per step</li>
     *                  <li>total time to run for - this must be a multiple of the time delta</li>
     *                </ul>
     * @throws Exception if an error occurs during the simulation.
     */
    @Override
    public void handleTextMessage(
            WebSocketSession session,
            TextMessage message
    ) throws Exception {
        try {

            // deserialize and get the request params
            WebsocketRequestDTO request = objectMapper.readValue(
                    message.getPayload(),
                    WebsocketRequestDTO.class
            );
            String sessionID = request.getSessionID();
            double totalTime = request.getTotalTime();
            double deltaTime = request.getDeltaTime();

            if (sessionID == null || totalTime <= 0 || deltaTime <= 0) {
                session.sendMessage(new TextMessage("Invalid payload"));
                return;
            }

            // run the simulation and construct the response
            WebSocketResponseDTO responseDTO = simulationSessionService.runSimulation(
                    sessionID,
                    totalTime,
                    deltaTime
            );

            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(responseDTO)));
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