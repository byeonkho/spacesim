package personal.spacesim.utils.serializers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import personal.spacesim.dtos.WebSocketResponseDTO;

@Component
public class WebSocketResponseSizeSerializer {


    private final ObjectMapper objectMapper;
    private static final Logger logger = LoggerFactory.getLogger(WebSocketResponseSizeSerializer.class);

    @Autowired
    public WebSocketResponseSizeSerializer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void printResponseSize(WebSocketResponseDTO responseDTO) {
        try {
            // Serialize to JSON string
            String jsonString = objectMapper.writeValueAsString(responseDTO);

            // Convert to byte array and get the length
            byte[] jsonBytes = jsonString.getBytes("UTF-8");
            int sizeInBytes = jsonBytes.length;

            // Print the size
            logger.info("Size of WebSocketResponseDTO in mb: " + sizeInBytes / 1_000_000);

        } catch (Exception e) {
            logger.error("Error calculating size of WebSocketResponseDTO: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
