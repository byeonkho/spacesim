package personal.spacesim.utils;

import com.github.luben.zstd.Zstd;
import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;

@Component
public class ZstdCompressor {

    public byte[] compress(String data) {
        byte[] uncompressedBytes = data.getBytes(StandardCharsets.UTF_8);
        byte[] compressedBytes = Zstd.compress(uncompressedBytes);

        ByteBuffer buffer = ByteBuffer.allocate(4 + compressedBytes.length); //
        buffer.order(ByteOrder.LITTLE_ENDIAN); // endianness applies to primitive types only; the raw compressed data
        // is left as is
        buffer.putInt(uncompressedBytes.length);
        buffer.put(compressedBytes);

        return buffer.array();
    }
}
