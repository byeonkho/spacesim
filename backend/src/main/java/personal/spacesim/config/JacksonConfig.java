package personal.spacesim.config;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.time.AbsoluteDate;
import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import personal.spacesim.utils.serializers.AbsoluteDateDeserializer;
import personal.spacesim.utils.serializers.AbsoluteDateSerializer;
import personal.spacesim.utils.serializers.Vector3DSerializer;
import tools.jackson.core.StreamWriteFeature;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.module.SimpleModule;

@Configuration(proxyBeanMethods = false)
public class JacksonConfig {

    @Bean
    JsonMapperBuilderCustomizer spacesimJsonMapperCustomizer() {
        return builder -> {
            SimpleModule module = new SimpleModule("spacesim-json");
            module.addSerializer(Vector3D.class, new Vector3DSerializer());
            module.addSerializer(AbsoluteDate.class, new AbsoluteDateSerializer());
            module.addDeserializer(AbsoluteDate.class, new AbsoluteDateDeserializer());
            builder.addModule(module);
            builder.disable(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES);
            builder.enable(StreamWriteFeature.WRITE_BIGDECIMAL_AS_PLAIN);
        };
    }
}
