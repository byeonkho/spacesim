package personal.spacesim.simulation;

import org.orekit.frames.Frame;
import org.orekit.frames.FramesFactory;
import personal.spacesim.orekit.CustomFrameFactory;

public class FrameWrapper {
    private Frame currentFrame;

    public FrameWrapper() {
        setFrame("HELIOCENTRIC");
    }

    public FrameWrapper(String frameName) {
        setFrame(frameName);
    }

    public void setFrame(String frameName) {
        switch (frameName.toUpperCase()) {
            case "ICRF":
                this.currentFrame = FramesFactory.getICRF();
                break;
            case "GCRF":
                this.currentFrame = FramesFactory.getGCRF();
                break;
            case "HELIOCENTRIC":
                this.currentFrame = CustomFrameFactory.createHeliocentricFrame();
                break;
            // Add more cases as needed
            default:
                throw new IllegalArgumentException("Unknown frame: " + frameName);
        }
    }

    public Frame getCurrentFrame() {
        return this.currentFrame;
    }
}