package personal.spacesim.simulation;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.orekit.data.DataContext;
import org.orekit.data.DataProvidersManager;
import org.orekit.data.DirectoryCrawler;
import org.orekit.frames.Frame;
import org.orekit.frames.FramesFactory;
import org.orekit.time.AbsoluteDate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import personal.spacesim.services.implementation.CelestialBodyWrapper;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class SimulationTest {

    @Mock
    private FrameWrapper frameWrapper;

    @InjectMocks
    private Simulation simulation;

    @BeforeAll
    static void setUpClass() throws IOException {
        // Initialize Orekit data providers
        File orekitData = new File("/Users/byeonkho/Desktop/personal projs/orekit-data");
        DataProvidersManager manager = DataContext.getDefault().getDataProvidersManager();
        manager.addProvider(new DirectoryCrawler(orekitData));
    }


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Mock the getCurrentFrame method to return a valid Frame
        when(frameWrapper.getCurrentFrame()).thenReturn(FramesFactory.getICRF());
    }

    @Test
    void testAddCelestialBody() {
        CelestialBodyWrapper body = mock(CelestialBodyWrapper.class);
        simulation.addCelestialBody(body);
        assertEquals(1, simulation.getCelestialBodies().size());
        assertTrue(simulation.getCelestialBodies().contains(body));
    }

    @Test
    void testGetCelestialBodies() {
        CelestialBodyWrapper body1 = mock(CelestialBodyWrapper.class);
        CelestialBodyWrapper body2 = mock(CelestialBodyWrapper.class);
        simulation.addCelestialBody(body1);
        simulation.addCelestialBody(body2);

        List<CelestialBodyWrapper> bodies = simulation.getCelestialBodies();
        assertEquals(2, bodies.size());
        assertTrue(bodies.contains(body1));
        assertTrue(bodies.contains(body2));
    }

    @Test
    void testSetReferenceFrame() {
        simulation.setReferenceFrame("HELIOCENTRIC");
        verify(frameWrapper, times(1)).setFrame("HELIOCENTRIC");
    }

    @Test
    void testUpdate() {
        CelestialBodyWrapper body = mock(CelestialBodyWrapper.class);
        simulation.addCelestialBody(body);
        AbsoluteDate initialDate = AbsoluteDate.J2000_EPOCH;
        simulation.update(3600.0);
        verify(body, times(1)).getPosition(any(Frame.class), any(AbsoluteDate.class));
        verify(body, times(1)).getVelocity(any(Frame.class), any(AbsoluteDate.class));
    }

    @Test
    void testRun() {
        CelestialBodyWrapper body = mock(CelestialBodyWrapper.class);
        simulation.addCelestialBody(body);
        simulation.run(7200.0, 3600.0);
        verify(body, times(2)).getPosition(any(Frame.class), any(AbsoluteDate.class));
        verify(body, times(2)).getVelocity(any(Frame.class), any(AbsoluteDate.class));
    }
}