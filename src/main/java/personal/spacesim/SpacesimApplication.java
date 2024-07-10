package personal.spacesim;

import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import personal.spacesim.services.implementation.*;
import personal.spacesim.simulation.Simulation;

@SpringBootApplication
public class SpacesimApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(SpacesimApplication.class, args);
	}

	@Override
	public void run(String... args) {
//		AbsoluteDate date = new AbsoluteDate(2024, 5, 1, TimeScalesFactory.getUTC());

//		 Initialize celestial bodies and add them to the simulation
//		CelestialBodyWrapper sun = new CelestialBodyWrapper("Sun", heliocentricFrame, date);
//		CelestialBodyWrapper earth = new CelestialBodyWrapper("Earth", heliocentricFrame, date);
//		CelestialBodyWrapper mars = new CelestialBodyWrapper("Mars", heliocentricFrame, date);
//		CelestialBodyWrapper moon = new CelestialBodyWrapper("Moon", heliocentricFrame, date);

//		simulation.addCelestialBody(earthService);
//		simulation.addCelestialBody(marsService);
//		simulation.addCelestialBody(moonService);
//		simulation.addCelestialBody(sunService);


		// Optionally, run a simple simulation to verify initialization
//		simulation.run(86400, 60); // Run for one day with 1-minute timesteps
	}
}
