package personal.spacesim.utils.serializers;

import org.orekit.time.AbsoluteDate;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonGenerator;
import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ValueSerializer;

public class AbsoluteDateSerializer extends ValueSerializer<AbsoluteDate> {

    @Override
    public void serialize(
            AbsoluteDate value,
            JsonGenerator generator,
            SerializationContext context
    ) throws JacksonException {
        generator.writeString(value.toString());
    }
}
