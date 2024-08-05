package personal.spacesim.simulation;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.orekit.data.DataContext;
import org.orekit.data.DataProvidersManager;
import org.orekit.data.DirectoryCrawler;
import org.orekit.frames.Frame;
import org.orekit.frames.FramesFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import personal.spacesim.simulation.frame.CustomFrameFactory;

import java.io.File;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class FrameWrapperTest {

    @Autowired
    private FrameWrapper frameWrapper;

    @BeforeAll
    static void setUpClass() throws IOException {
        // Initialize Orekit data providers
        File orekitData = new File("/Users/byeonkho/Desktop/personal projs/orekit-data");
        DataProvidersManager manager = DataContext.getDefault().getDataProvidersManager();
        manager.addProvider(new DirectoryCrawler(orekitData));
    }

    @Test
    void testSetFrameICRF() {
        frameWrapper.setFrame("ICRF");
        Frame expectedFrame = FramesFactory.getICRF();
        Frame actualFrame = frameWrapper.getCurrentFrame();
        assertNotNull(actualFrame);
        assertEquals(expectedFrame.getName(), actualFrame.getName());
    }

    @Test
    void testSetFrameGCRF() {
        frameWrapper.setFrame("GCRF");
        Frame expectedFrame = FramesFactory.getGCRF();
        Frame actualFrame = frameWrapper.getCurrentFrame();
        assertNotNull(actualFrame);
        assertEquals(expectedFrame.getName(), actualFrame.getName());
    }

    @Test
    void testSetFrameHeliocentric() {
        frameWrapper.setFrame("HELIOCENTRIC");
        Frame expectedFrame = CustomFrameFactory.createHeliocentricFrame();
        Frame actualFrame = frameWrapper.getCurrentFrame();
        assertNotNull(actualFrame);
        assertEquals(expectedFrame.getName(), actualFrame.getName());
    }

    @Test
    void testSetFrameUnknown() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            frameWrapper.setFrame("UNKNOWN");
        });
        assertEquals("Unknown frame: UNKNOWN", exception.getMessage());
    }
}