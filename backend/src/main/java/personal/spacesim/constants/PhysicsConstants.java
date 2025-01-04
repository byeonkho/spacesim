package personal.spacesim.constants;
import lombok.Getter;
import org.orekit.utils.Constants;

import java.util.HashMap;
import java.util.Map;

@Getter
public class PhysicsConstants {
    public static final double GRAVITATIONAL_CONSTANT = 6.67430e-11; // in m^3 kg^-1 s^-2
    public static final double SECONDS_PER_HOUR = 3600;
    public static final double SECONDS_PER_DAY = 86400;
    public static final double SECONDS_PER_WEEK = 604800;

    public static final Map<String, Double> RADIUS_MAP = new HashMap<>();
    static {
        RADIUS_MAP.put("EARTH", Constants.EGM96_EARTH_EQUATORIAL_RADIUS);
        RADIUS_MAP.put("MARS", 3_389_500.0);
        RADIUS_MAP.put("MOON", Constants.MOON_EQUATORIAL_RADIUS);
        RADIUS_MAP.put("SUN", Constants.SUN_RADIUS);
        RADIUS_MAP.put("VENUS", 6_051_800.0);
        RADIUS_MAP.put("MERCURY", 2_439_700.0);
        RADIUS_MAP.put("JUPITER", Constants.IAU_2015_NOMINAL_JUPITER_EQUATORIAL_RADIUS);
        RADIUS_MAP.put("SATURN", 58_232_000.0);
        RADIUS_MAP.put("URANUS", 25_362_000.0);
        RADIUS_MAP.put("NEPTUNE", 24_622_000.0);
    }

    private PhysicsConstants() {
    }
}