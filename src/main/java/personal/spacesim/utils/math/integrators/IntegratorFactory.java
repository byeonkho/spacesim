package personal.spacesim.utils.math.integrators;

import org.springframework.stereotype.Component;

@Component
public class IntegratorFactory {

    public Integrator createIntegrator(String type) {
        switch (type.toLowerCase()) {
            case "euler":
                return new EulerIntegrator();
            case "rungekutta":
                return new RungeKuttaIntegrator();
            // Add more cases for other integrator types
            default:
                throw new IllegalArgumentException("Unknown integrator type: " + type);
        }
    }
}