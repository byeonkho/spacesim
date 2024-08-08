package personal.spacesim.utils.serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import personal.spacesim.dtos.WebSocketResponseDTO;
import personal.spacesim.dtos.WebSocketResponseKey;
import personal.spacesim.simulation.body.CelestialBodySnapshot;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class WebSocketResponseSerializer extends JsonSerializer<WebSocketResponseDTO> {

    @Override
    public void serialize(WebSocketResponseDTO value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();
        for (Map.Entry<WebSocketResponseKey, List<CelestialBodySnapshot>> entry : value.getResults().entrySet()) {
            String fieldName = "date: " + entry.getKey().getDate().toString();  // Prepend "date: " to the date string
            gen.writeFieldName(fieldName);
            gen.writeObject(entry.getValue());
        }
        gen.writeEndObject();
    }
}