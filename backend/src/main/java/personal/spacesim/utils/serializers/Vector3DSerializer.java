package personal.spacesim.utils.serializers;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonGenerator;
import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ValueSerializer;

public class Vector3DSerializer extends ValueSerializer<Vector3D> {

    @Override
    public void serialize(
            Vector3D value,
            JsonGenerator generator,
            SerializationContext context
    ) throws JacksonException {
        generator.writeStartObject();
        generator.writeNumberProperty("x", value.getX());
        generator.writeNumberProperty("y", value.getY());
        generator.writeNumberProperty("z", value.getZ());
        generator.writeEndObject();
    }
}
