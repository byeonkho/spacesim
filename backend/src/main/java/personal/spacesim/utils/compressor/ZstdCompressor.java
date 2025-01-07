package personal.spacesim.utils.compressor;

import com.github.luben.zstd.Zstd;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import personal.spacesim.apis.websocket.WebSocketHandler;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;

@Component
public class ZstdCompressor {

    private final Logger logger = LoggerFactory.getLogger(ZstdCompressor.class);

    public byte[] compress(String data) {
        byte[] uncompressedBytes = data.getBytes(StandardCharsets.UTF_8);
        byte[] compressedBytes = Zstd.compress(uncompressedBytes);

        ByteBuffer buffer = ByteBuffer.allocate(4 + compressedBytes.length); //
        buffer.order(ByteOrder.LITTLE_ENDIAN); // endianness applies to primitive types only; the raw compressed data
        // is left as is
        buffer.putInt(uncompressedBytes.length);
        buffer.put(compressedBytes);

        logger.info("Uncompressed  mb: {} ", uncompressedBytes.length / 1_000_000);
        logger.info("Compressed  mb: {} ", compressedBytes.length / 1_000_000);

        return buffer.array();
    }
}
