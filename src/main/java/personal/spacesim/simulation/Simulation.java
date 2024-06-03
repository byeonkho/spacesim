package personal.spacesim.simulation;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.time.AbsoluteDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import personal.spacesim.services.implementation.CelestialBodyWrapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class Simulation {
    private FrameContext frameContext;
    private List<CelestialBodyWrapper> celestialBodies;
    private AbsoluteDate currentDate;

    @Autowired
    public Simulation(FrameContext frameContext) {
        this.frameContext = frameContext;
        this.celestialBodies = new ArrayList<>();
        this.currentDate = AbsoluteDate.J2000_EPOCH;
    }

    public void addCelestialBody(CelestialBodyWrapper body) {
        this.celestialBodies.add(body);
    }

    public void setReferenceFrame(String frameName) {
        this.frameContext.setFrame(frameName);
    }

    public void update(double deltaTime) {
        this.currentDate = currentDate.shiftedBy(deltaTime);
        for (CelestialBodyWrapper body : celestialBodies) {
            Vector3D position = body.getPosition(frameContext.getCurrentFrame(), currentDate);
            Vector3D velocity = body.getVelocity(frameContext.getCurrentFrame(), currentDate);
            // Handle position and velocity updates as needed
        }
    }

    public void run(double totalTime, double deltaTime) {
        double currentTime = 0;
        while (currentTime < totalTime) {
            update(deltaTime);
            currentTime += deltaTime;
        }
    }
}