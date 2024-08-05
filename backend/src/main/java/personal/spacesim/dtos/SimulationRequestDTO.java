package personal.spacesim.dtos;

import java.util.List;

public class SimulationRequestDTO {
    private List<String> celestialBodyNames;
    private String date;
    private String frame;
    private String integrator;

    public List<String> getCelestialBodyNames() {
        return celestialBodyNames;
    }

    public String getDate() {
        return date;
    }

    public String getFrame() {
        return frame;
    }

    public String getIntegrator() {
        return integrator;
    }

}
