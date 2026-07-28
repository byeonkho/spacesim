package personal.spacesim.config;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.junit.jupiter.api.Test;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import tools.jackson.databind.json.JsonMapper;

import java.math.BigDecimal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class JsonContractTest {

    private record WirePayload(AbsoluteDate date, Vector3D vector) {}

    @Autowired
    private JsonMapper mapper;

    @Test
    void preservesAbsoluteDateAndVector3DWireShape() throws Exception {
        AbsoluteDate date = new AbsoluteDate(
                "2024-06-05T00:00:00.000",
                TimeScalesFactory.getUTC());
        WirePayload payload = new WirePayload(
                date,
                new Vector3D(1.25, -2.5, 3.75));

        assertEquals(
                "{\"date\":\"2024-06-05T00:00:00.000Z\","
                        + "\"vector\":{\"x\":1.25,\"y\":-2.5,\"z\":3.75}}",
                mapper.writeValueAsString(payload));
        assertEquals(
                date,
                mapper.readValue(
                        "\"2024-06-05T00:00:00.000Z\"",
                        AbsoluteDate.class));
    }

    @Test
    void writesBigDecimalWithoutExponentNotation() throws Exception {
        assertEquals(
                "{\"value\":1000}",
                mapper.writeValueAsString(
                        Map.of("value", new BigDecimal("1E+3"))));
    }
}
