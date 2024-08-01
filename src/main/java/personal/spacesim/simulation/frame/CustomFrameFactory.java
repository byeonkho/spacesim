package personal.spacesim.simulation.frame;

import org.orekit.bodies.CelestialBody;
import org.orekit.bodies.CelestialBodyFactory;
import org.orekit.frames.Frame;
import org.orekit.frames.FramesFactory;
import org.orekit.frames.TransformProvider;
import org.springframework.stereotype.Component;

@Component
public class CustomFrameFactory {

    public static Frame createFrame(String frameName) {
        switch (frameName.toUpperCase()) {
            case "HELIOCENTRIC":
                return createHeliocentricFrame();
            case "ICRF":
                return FramesFactory.getICRF();
            case "GCRF":
                return FramesFactory.getGCRF();
            default:
                throw new IllegalArgumentException("Unknown frame name: " + frameName);
        }
    }

    private static Frame createHeliocentricFrame() {
        // Get the ICRF frame
        Frame icrfFrame = FramesFactory.getICRF();

        // Init the Sun and setup for transform into Heliocentric frame
        CelestialBody sun = CelestialBodyFactory.getSun();
        TransformProvider sunTransformProvider = sun.getInertiallyOrientedFrame().getTransformProvider();

        // Create the heliocentric frame
        return new Frame(icrfFrame, sunTransformProvider, "Heliocentric Frame");
    }

    // Example for creating the GCRF frame
    private Frame createGCRF() {
        return FramesFactory.getGCRF();
    }


    // Add more private methods for creating other frames here
}