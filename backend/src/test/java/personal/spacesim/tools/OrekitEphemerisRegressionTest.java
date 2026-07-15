package personal.spacesim.tools;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.junit.jupiter.api.Test;
import org.orekit.bodies.CelestialBodyFactory;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.orekit.utils.PVCoordinates;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import personal.spacesim.simulation.frame.CustomFrameFactory;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Pins the Orekit states that seed simulations at a review-scale threshold.
 * References were captured from Orekit 13.1.6 using the bundled DE-440 data.
 * The limits are drift alarms, not claims about absolute ephemeris accuracy.
 */
@SpringBootTest
class OrekitEphemerisRegressionTest {

    private static final double POSITION_TOLERANCE_METRES = 100.0;
    private static final double VELOCITY_TOLERANCE_METRES_PER_SECOND = 1.0e-4;

    private record Reference(
            String epoch,
            String frame,
            String body,
            double px,
            double py,
            double pz,
            double vx,
            double vy,
            double vz
    ) {}

    private static final Reference[] REFERENCES = {
            new Reference("2000-01-01T12:00:00.000000000000000000", "icrf", "MERCURY",
                    -2.05270580639920500e+10, -6.03245521291761000e+10, -3.01313768805159650e+10,
                    +3.70047922374548100e+04, -8.53987461516099400e+03, -8.39762059825724000e+03),
            new Reference("2000-01-01T12:00:00.000000000000000000", "icrf", "EARTH",
                    -2.75686521954817900e+10, +1.32361058312748500e+11, +5.74185133189322700e+10,
                    -2.97848779791252530e+04, -5.03011033830515000e+03, -2.18079944865493230e+03),
            new Reference("2000-01-01T12:00:00.000000000000000000", "icrf", "JUPITER",
                    +5.97499369705418700e+11, +4.08990966797321300e+11, +1.60756574133874700e+11,
                    -7.90053755344298100e+03, +1.01717878054463690e+04, +4.55246444495738250e+03),
            new Reference("2000-01-01T12:00:00.000000000000000000", "icrf", "MOON",
                    -2.78602192719900470e+10, +1.32094298730604030e+11, +5.73423914925202200e+10,
                    -2.91412296389289300e+04, -5.69609290649835500e+03, -2.48209539373503550e+03),
            new Reference("2000-01-01T12:00:00.000000000000000000", "icrf", "PLUTO",
                    -1.47839903562649340e+12, -4.18597525747016400e+12, -8.60878191477832200e+11,
                    +5.25346406758565500e+03, -1.96408021198269420e+03, -2.19576807472000560e+03),
            new Reference("2000-01-01T12:00:00.000000000000000000", "heliocentric", "MERCURY",
                    -3.53425124652668900e+10, -6.00413093788349300e+10, -3.95474587706427760e+09,
                    +3.31698317210139140e+04, -2.02787939075019240e+04, +5.99913288629674800e+02),
            new Reference("2000-01-01T12:00:00.000000000000000000", "heliocentric", "EARTH",
                    +1.14245629468039050e+10, +1.46455345240968260e+11, -7.73417459799430100e+09,
                    -3.00155098105214570e+04, +2.14510361576087050e+03, -3.47547547002868500e+03),
            new Reference("2000-01-01T12:00:00.000000000000000000", "heliocentric", "JUPITER",
                    +6.88738723972073400e+11, +2.74640125249385130e+11, +4.44873011864923400e+10,
                    -4.76931620630396100e+03, +1.27629598977409260e+04, -1.18424388532253760e+03),
            new Reference("2000-01-01T12:00:00.000000000000000000", "heliocentric", "MOON",
                    +1.10703632243536300e+10, +1.46264476340675350e+11, -7.72533227121594200e+09,
                    -2.95822211769152100e+04, +1.27748928896740100e+03, -3.38546684029378000e+03),
            new Reference("2000-01-01T12:00:00.000000000000000000", "heliocentric", "PLUTO",
                    -2.58200234000243460e+12, -3.62046684662029440e+12, +8.17275083082777100e+11,
                    +4.49530395659170200e+03, -3.95657809665541200e+03, -4.99002458293027760e+02),
            new Reference("2024-10-20T07:00:00.123456789012345678", "icrf", "MERCURY",
                    -2.67719658900797040e+10, -5.87094663891982500e+10, -2.85892123763108100e+10,
                    +3.54411644931547300e+04, -1.26155002742825050e+04, -1.04107505033736140e+04),
            new Reference("2024-10-20T07:00:00.123456789012345678", "icrf", "EARTH",
                    +1.31736337222567180e+11, +6.14827798034431900e+10, +2.66812660291263700e+10,
                    -1.40041464278411660e+04, +2.42285861086269540e+04, +1.05019357634125300e+04),
            new Reference("2024-10-20T07:00:00.123456789012345678", "icrf", "JUPITER",
                    +2.37253508523147250e+11, +6.61759496727365800e+11, +2.77877663247038640e+11,
                    -1.25531145655242600e+04, +4.22977433663596300e+03, +2.11861222064912000e+03),
            new Reference("2024-10-20T07:00:00.123456789012345678", "icrf", "MOON",
                    +1.31883551941908250e+11, +6.17782774465388000e+10, +2.68411383354573750e+10,
                    -1.49592684124123720e+04, +2.46508609404539930e+04, +1.07434752905161800e+04),
            new Reference("2024-10-20T07:00:00.123456789012345678", "icrf", "PLUTO",
                    +2.69598634875759770e+12, -4.00997359498176950e+12, -2.06368291277298970e+12,
                    +4.80725936080579800e+03, +2.08376282741709340e+03, -7.98133675770400600e+02),
            new Reference("2024-10-20T07:00:00.123456789012345678", "heliocentric", "MERCURY",
                    -4.09531170622271040e+10, -5.61151636193178700e+10, -4.03969198735264970e+09,
                    +3.05318660538821350e+04, -2.42947294596295540e+04, +3.25375678845119200e+02),
            new Reference("2024-10-20T07:00:00.123456789012345678", "heliocentric", "EARTH",
                    +1.44706850550676330e+11, +3.23510245516223680e+10, +1.41260438944835280e+10,
                    -6.73103337032239700e+03, +2.90245942100389950e+04, -2.53678613856103130e+03),
            new Reference("2024-10-20T07:00:00.123456789012345678", "heliocentric", "JUPITER",
                    +4.12837697668357360e+11, +6.34372964348366000e+11, -1.40048575058654790e+09,
                    -1.08931465385924060e+04, +7.72251799225864850e+03, -1.42483192816131900e+03),
            new Reference("2024-10-20T07:00:00.123456789012345678", "heliocentric", "MOON",
                    +1.44930364458077700e+11, +3.26395681353037030e+10, +1.41625722192719080e+10,
                    -7.53124043845964800e+03, +2.97333934513629200e+04, -2.61544785581331050e+03),
            new Reference("2024-10-20T07:00:00.123456789012345678", "heliocentric", "PLUTO",
                    +1.47688958040289750e+12, -5.03929497968323500e+12, +1.73667623013251700e+11,
                    +5.18761586306960450e+03, +2.57026886901731800e+02, -1.01145797988827560e+03),
            new Reference("2050-01-01T00:00:00.000000000000000000", "icrf", "MERCURY",
                    -2.67385720780544700e+10, +3.40115812314814830e+10, +2.10011030085278740e+10,
                    -5.02794457346148200e+04, -2.41713364891677370e+04, -7.70546268102581100e+03),
            new Reference("2050-01-01T00:00:00.000000000000000000", "icrf", "EARTH",
                    -2.55550517752774350e+10, +1.32440150375126800e+11, +5.74041961457536900e+10,
                    -2.98028961646092430e+04, -4.88093197518501350e+03, -2.11443014571424330e+03),
            new Reference("2050-01-01T00:00:00.000000000000000000", "icrf", "JUPITER",
                    -3.57576432944193360e+11, +6.37675485035916500e+11, +2.82006661198125400e+11,
                    -1.17952093916714380e+04, -5.02968513146352500e+03, -1.86863998252008300e+03),
            new Reference("2050-01-01T00:00:00.000000000000000000", "icrf", "MOON",
                    -2.51954894665427930e+10, +1.32538266226514220e+11, +5.74711302430777300e+10,
                    -3.00673157401758180e+04, -3.93892064007510600e+03, -1.77953724526705630e+03),
            new Reference("2050-01-01T00:00:00.000000000000000000", "icrf", "PLUTO",
                    +5.60329996718036200e+12, -1.52916258635113620e+12, -2.16545388108241670e+12,
                    +2.42594235072681200e+03, +3.78081101213392550e+03, +4.48966760374082100e+02),
            new Reference("2050-01-01T00:00:00.000000000000000000", "heliocentric", "MERCURY",
                    -1.62234831025426060e+10, +4.57681784282355900e+10, +1.16144318145318220e+09,
                    -5.50253146565374900e+04, -1.17008257366454200e+04, -2.84444895469936270e+03),
            new Reference("2050-01-01T00:00:00.000000000000000000", "heliocentric", "EARTH",
                    +1.22586430616754630e+10, +1.46395380226613100e+11, -7.65353732471747600e+09,
                    -2.99956332144776530e+04, +2.29126764267992940e+03, -3.48069041054717600e+03),
            new Reference("2050-01-01T00:00:00.000000000000000000", "heliocentric", "JUPITER",
                    -1.66329017387923770e+11, +7.63868834366111200e+11, -6.03810369704695100e+10,
                    -1.27381665216049820e+04, -2.22032444558566200e+03, -9.93784020761916700e+02),
            new Reference("2050-01-01T00:00:00.000000000000000000", "heliocentric", "MOON",
                    +1.26313090941615750e+10, +1.46419795625079830e+11, -7.59096045926851700e+09,
                    -2.99879361998404600e+04, +3.31715184764379400e+03, -3.61091589253753800e+03),
            new Reference("2050-01-01T00:00:00.000000000000000000", "heliocentric", "PLUTO",
                    +4.95790453276428800e+12, -3.66959938737148140e+12, -6.11641267289855500e+11,
                    +3.37086439470132430e+03, +2.85192586661099130e+03, -9.00510770151385900e+02)
    };

    @Autowired
    private CustomFrameFactory frameFactory;

    @Test
    void positionsStayWithinReviewThreshold() {
        for (Reference reference : REFERENCES) {
            PVCoordinates actual = actualState(reference);
            Vector3D expected = new Vector3D(reference.px(), reference.py(), reference.pz());
            double errorMetres = Vector3D.distance(expected, actual.getPosition());

            assertTrue(errorMetres <= POSITION_TOLERANCE_METRES,
                    () -> String.format(
                            "%s %s position at %s drifted %.6f m (limit %.1f m)",
                            reference.frame(), reference.body(), reference.epoch(),
                            errorMetres, POSITION_TOLERANCE_METRES));
        }
    }

    @Test
    void velocitiesStayWithinReviewThreshold() {
        for (Reference reference : REFERENCES) {
            PVCoordinates actual = actualState(reference);
            Vector3D expected = new Vector3D(reference.vx(), reference.vy(), reference.vz());
            double errorMetresPerSecond = Vector3D.distance(expected, actual.getVelocity());

            assertTrue(errorMetresPerSecond <= VELOCITY_TOLERANCE_METRES_PER_SECOND,
                    () -> String.format(
                            "%s %s velocity at %s drifted %.9f m/s (limit %.9f m/s)",
                            reference.frame(), reference.body(), reference.epoch(),
                            errorMetresPerSecond, VELOCITY_TOLERANCE_METRES_PER_SECOND));
        }
    }

    private PVCoordinates actualState(Reference reference) {
        AbsoluteDate date = new AbsoluteDate(reference.epoch(), TimeScalesFactory.getUTC());
        Frame frame = frameFactory.createFrame(reference.frame());
        return CelestialBodyFactory.getBody(reference.body()).getPVCoordinates(date, frame);
    }
}
