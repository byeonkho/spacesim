package personal.spacesim.utils;
import org.orekit.utils.Constants;


public class CustomConstants {
    public static final double GRAVITATIONAL_CONSTANT = 6.67430e-11; // in m^3 kg^-1 s^-2

    public static final double EARTH_RADIUS = Constants.EGM96_EARTH_EQUATORIAL_RADIUS;
    public static final double MARS_RADIUS = 3_389_500;
    public static final double MOON_RADIUS = Constants.MOON_EQUATORIAL_RADIUS;
    public static final double SUN_RADIUS = Constants.SUN_RADIUS;
    public static final double VENUS_RADIUS = 6_051_800;
    public static final double MERCURY_RADIUS = 2_439_700;
    public static final double JUPITER_RADIUS = Constants.IAU_2015_NOMINAL_JUPITER_EQUATORIAL_RADIUS;
    public static final double SATURN_RADIUS = 58_232_000;
    public static final double URANUS_RADIUS = 25_362_000;
    public static final double NEPTUNE_RADIUS = 24_622_000;

    private CustomConstants() {
    }
}