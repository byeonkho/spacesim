package personal.spacesim.utils.serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.dtos.WebSocketResponseDTO;
import personal.spacesim.simulation.body.CelestialBodySnapshot;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class WebSocketResponseDTOSerializer extends JsonSerializer<WebSocketResponseDTO> {

    @Override
    public void serialize(WebSocketResponseDTO value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();

        // Serialize the messageType field
        gen.writeStringField("messageType", value.getMessageType());

        // Serialize the payload if it's not null
        Map<AbsoluteDate, List<CelestialBodySnapshot>> payload = value.getData();
        if (payload != null) {
            gen.writeFieldName("data");
            gen.writeStartObject();

            for (Map.Entry<AbsoluteDate, List<CelestialBodySnapshot>> entry : payload.entrySet()) {
                String fieldName = "date: " + entry.getKey()
                        .getDate()
                        .toString();  // Prepend "date: " to the date string
                gen.writeFieldName(fieldName);
                gen.writeObject(entry.getValue());
            }

            gen.writeEndObject();
        } else {
            gen.writeNullField("data");
        }

        gen.writeEndObject();
    }
}
