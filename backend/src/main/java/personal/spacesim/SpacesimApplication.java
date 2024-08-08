package personal.spacesim;


import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;


@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}) // exclude looking for db source in application
// .properties
public class SpacesimApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(SpacesimApplication.class, args);
	}

	@Override
	public void run(String... args) {

	}
}
