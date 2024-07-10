package personal.spacesim.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.hipparchus.geometry.euclidean.threed.Vector3D;

import java.io.IOException;

public class Vector3DSerializer extends JsonSerializer<Vector3D> {

    @Override
    public void serialize(Vector3D value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();
        gen.writeNumberField("x", value.getX());
        gen.writeNumberField("y", value.getY());
        gen.writeNumberField("z", value.getZ());
        gen.writeEndObject();
    }
}