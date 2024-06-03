package personal.spacesim.orekit;

import org.hipparchus.CalculusFieldElement;
import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.frames.FieldTransform;
import org.orekit.frames.FramesFactory;
import org.orekit.frames.Transform;
import org.orekit.frames.TransformProvider;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.FieldAbsoluteDate;
import org.orekit.utils.PVCoordinates;
import org.orekit.utils.PVCoordinatesProvider;

public class SunTransformProvider implements TransformProvider {

    private final PVCoordinatesProvider sunPVProvider;

    public SunTransformProvider(PVCoordinatesProvider sunPVProvider) {
        this.sunPVProvider = sunPVProvider;
    }

    @Override
    public Transform getTransform(AbsoluteDate date) {
        //PV coordinates of the Sun using ICRF
        PVCoordinates pvCoordinates = sunPVProvider.getPVCoordinates(date, FramesFactory.getICRF());
        return new Transform(date, pvCoordinates.negate());
    }

    @Override
    public <T extends CalculusFieldElement<T>> FieldTransform<T> getTransform(FieldAbsoluteDate<T> fieldAbsoluteDate) {
        return null;
    }
}
