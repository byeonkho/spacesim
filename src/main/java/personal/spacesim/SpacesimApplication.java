package personal.spacesim;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import personal.spacesim.services.implementation.EarthService;


@SpringBootApplication
public class SpacesimApplication implements CommandLineRunner {

	//Orekit is initialized in CustomFrameFactory
	@Autowired
	private Frame heliocentricFrame;

	@Autowired
	private EarthService earthService;

	public static void main(String[] args) {
		SpringApplication.run(SpacesimApplication.class, args);
	}

	@Override
	public void run(String... args) {
		AbsoluteDate date = new AbsoluteDate(2024, 5, 1, TimeScalesFactory.getUTC());

		Vector3D earthPosition = earthService.getPosition(heliocentricFrame, date);
		Vector3D earthVelocity = earthService.getVelocity(heliocentricFrame, date);

		System.out.println("Heliocentric Position of Earth (in meters): " + earthPosition);
		System.out.println("Heliocentric Velocity of Earth (in meters per second): " + earthVelocity);
	}
}
