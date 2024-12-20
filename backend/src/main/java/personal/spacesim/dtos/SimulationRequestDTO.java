package personal.spacesim.dtos;

import lombok.Data;

import java.util.List;

@Data
public class SimulationRequestDTO {
    private List<String> celestialBodyNames;
    private String date;
    private String frame;
    private String integrator;
}
