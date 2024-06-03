package personal.spacesim.apis.controller;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import personal.spacesim.services.implementation.CelestialBodyWrapper;


import java.util.Map;

@RestController
@RequestMapping("/api")
public class PlanetController {

    // provided by CelestialServiceConfig
    private final Map<String, CelestialBodyWrapper> celestialServices;

    @Autowired
    public PlanetController(Map<String, CelestialBodyWrapper> celestialServices) {
        this.celestialServices = celestialServices;
    }

    @Autowired
    private Frame heliocentricFrame;

    @GetMapping("/planet-position")
    public Vector3D getPlanetPosition(@RequestParam String planetName, @RequestParam String dateStr) {
        AbsoluteDate date = new AbsoluteDate(dateStr, TimeScalesFactory.getUTC());
        Frame frame = heliocentricFrame;

        CelestialBodyWrapper service = celestialServices.get(planetName.toLowerCase());
        if (service == null) {
            throw new IllegalArgumentException("Unsupported planet: " + planetName);
        }

        return service.getPosition(frame, date);
    }

    @GetMapping("/planet-velocity")
    public Vector3D getPlanetVelocity(@RequestParam String planetName, @RequestParam String dateStr) {
        AbsoluteDate date = new AbsoluteDate(dateStr, TimeScalesFactory.getUTC());
        Frame frame = heliocentricFrame;

        CelestialBodyWrapper service = celestialServices.get(planetName.toLowerCase());
        if (service == null) {
            throw new IllegalArgumentException("Unsupported planet: " + planetName);
        }

        return service.getVelocity(frame, date);
    }
}