package personal.spacesim.simulation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import personal.spacesim.simulation.frame.CustomFrameFactory;
import personal.spacesim.simulation.body.CelestialBodyWrapper;
import personal.spacesim.simulation.body.CelestialBodyWrapperFactory;
import personal.spacesim.utils.math.integrators.Integrator;
import personal.spacesim.utils.math.integrators.IntegratorFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class SimulationFactory {

    // singleton DI configured in JacksonConfig; added Vector serialization

    private final IntegratorFactory integratorFactory;
    private final CelestialBodyWrapperFactory celestialBodyWrapperFactory;
    private final CustomFrameFactory customFrameFactory;

    @Autowired
    public SimulationFactory(IntegratorFactory integratorFactory,
                             CelestialBodyWrapperFactory celestialBodyWrapperFactory,
                             CustomFrameFactory customFrameFactory) {
        this.integratorFactory = integratorFactory;
        this.celestialBodyWrapperFactory = celestialBodyWrapperFactory;
        this.customFrameFactory = customFrameFactory;
    }

    public Simulation createSimulation(
            List<String> celestialBodyNames,
            String frameStr,
            String integratorStr,
            AbsoluteDate simStartDate
    ) {
        String sessionID = UUID.randomUUID().toString();

        // using singleton DI instead of static method
        Frame frame = customFrameFactory.createFrame(frameStr);
        Integrator integrator = integratorFactory.createIntegrator(integratorStr);

        List<CelestialBodyWrapper> celestialBodies = new ArrayList<>();
        for (String bodyName : celestialBodyNames) {
            CelestialBodyWrapper body = celestialBodyWrapperFactory.createCelestialBodyWrapper(bodyName, frame, simStartDate);
            celestialBodies.add(body);
        }

        return new Simulation(
                sessionID,
                celestialBodies,
                frame,
                integrator,
                simStartDate
        );
    }
}