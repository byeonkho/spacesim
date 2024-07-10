package personal.spacesim.apis.controller;

import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import personal.spacesim.simulation.FrameWrapper;
import personal.spacesim.simulation.Simulation;

import java.util.List;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    private final Simulation simulation;

    @Autowired
    public SimulationController(Simulation simulation) {
        this.simulation = simulation;
    }

    /**
     *
     * @param request List of Strings containing bodies to initialize, date, frame name
     * @return ResponseEntity with the body containing the ObjectMapper returned from initializeSimulation()
     */
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeSimulation(@RequestBody SimulationRequest request) {
        AbsoluteDate date = new AbsoluteDate(request.getDateStr(), TimeScalesFactory.getUTC());
        FrameWrapper frame = new FrameWrapper(request.getFrame());
        String initializedBodiesJson = simulation.initializeSimulation(request.getCelestialBodyNames(), date, frame);
        return ResponseEntity.ok(initializedBodiesJson);
    }
}

class SimulationRequest {
    private List<String> celestialBodyNames;
    private String dateStr;
    private String frame;

    public List<String> getCelestialBodyNames() {
        return celestialBodyNames;
    }

    public String getDateStr() {
        return dateStr;
    }

    public String getFrame() {
        return frame;
    }

}
