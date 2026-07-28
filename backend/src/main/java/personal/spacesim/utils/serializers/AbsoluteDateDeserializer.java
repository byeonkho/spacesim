package personal.spacesim.utils.serializers;

import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.ValueDeserializer;

public class AbsoluteDateDeserializer extends ValueDeserializer<AbsoluteDate> {

    @Override
    public AbsoluteDate deserialize(
            JsonParser parser,
            DeserializationContext context
    ) throws JacksonException {
        return new AbsoluteDate(parser.getString(), TimeScalesFactory.getUTC());
    }
}
