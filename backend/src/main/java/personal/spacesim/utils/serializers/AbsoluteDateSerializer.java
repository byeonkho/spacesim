package personal.spacesim.utils.serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.orekit.time.AbsoluteDate;

import java.io.IOException;

public class AbsoluteDateSerializer extends JsonSerializer<AbsoluteDate> {

    @Override
    public void serialize(AbsoluteDate value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(value.toString());
    }
}