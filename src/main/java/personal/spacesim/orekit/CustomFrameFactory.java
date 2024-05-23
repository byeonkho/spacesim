package personal.spacesim.orekit;

import org.orekit.bodies.CelestialBodyFactory;
import org.orekit.frames.Frame;
import org.orekit.frames.FramesFactory;
import org.orekit.frames.TransformProvider;

public class CustomFrameFactory {

    public static Frame createHeliocentricFrame() {
        OrekitInit.initializeOrekit(); // Ensure Orekit is initialized

        // Get the ICRF frame
        Frame icrfFrame = FramesFactory.getICRF();

        // Init the Sun and setup for transform into Heliocentric frame
        TransformProvider sunTransformProvider = new SunTransformProvider(CelestialBodyFactory.getSun());

        // Create the heliocentric frame
        return new Frame(icrfFrame, sunTransformProvider, "Heliocentric Frame");
    }
}
