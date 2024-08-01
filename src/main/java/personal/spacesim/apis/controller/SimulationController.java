package personal.spacesim.apis.controller;

import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import personal.spacesim.dtos.SimulationRequestDTO;
import personal.spacesim.dtos.SimulationResponseDTO;
import personal.spacesim.simulation.SimulationSessionService;
import personal.spacesim.simulation.body.CelestialBodyWrapper;

import java.util.List;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    private final SimulationSessionService simulationSessionService;

    @Autowired
    public SimulationController(SimulationSessionService simulationSessionService) {
        this.simulationSessionService = simulationSessionService;
    }

    @PostMapping("/initialize")
    public ResponseEntity<SimulationResponseDTO> initializeSimulation(@RequestBody SimulationRequestDTO request) {
        AbsoluteDate date = new AbsoluteDate(
                request.getDate(),
                TimeScalesFactory.getUTC()
        );
        List<String> celestialBodyNames = request.getCelestialBodyNames();
        String frameStr = request.getFrame();
        String integratorStr = request.getIntegrator();

        List<CelestialBodyWrapper> celestialBodyList = simulationSessionService.createSimulation(
                celestialBodyNames,
                frameStr,
                integratorStr,
                date
        );
        SimulationResponseDTO responseDTO = new SimulationResponseDTO(celestialBodyList);

        return ResponseEntity.ok(responseDTO);
    }

//    @PostMapping("/run")
//    public ResponseEntity<String> runSimulation(@RequestParam String sessionID, @RequestParam double totalTime, @RequestParam double deltaTime) {
//        simulationSessionService.runSimulation(sessionID, totalTime, deltaTime);
//        return ResponseEntity.ok("Simulation run for session: " + sessionID);
//    }
//
//    @PostMapping("/update")
//    public ResponseEntity<String> updateSimulation(@RequestParam String sessionID, @RequestParam double deltaTime) {
//        simulationSessionService.updateSimulation(sessionID, deltaTime);
//        return ResponseEntity.ok("Simulation updated for session: " + sessionID);
//    }

    @GetMapping("/results")
    public ResponseEntity<List<CelestialBodyWrapper>> getSimulationResults(@RequestParam String sessionID) {
        List<CelestialBodyWrapper> results = simulationSessionService.getSimulationResults(sessionID);
        return ResponseEntity.ok(results);
    }
}