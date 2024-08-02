package personal.spacesim.utils.serializers;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;

import java.io.IOException;

public class AbsoluteDateDeserializer extends JsonDeserializer<AbsoluteDate> {

    @Override
    public AbsoluteDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String dateString = p.getText();
        return new AbsoluteDate(dateString, TimeScalesFactory.getUTC());
    }
}