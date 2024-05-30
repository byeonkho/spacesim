package personal.spacesim.services.implementation;

import org.hipparchus.geometry.euclidean.threed.Vector3D;
import org.orekit.bodies.CelestialBody;
import org.orekit.bodies.CelestialBodyFactory;
import org.orekit.frames.Frame;
import org.orekit.time.AbsoluteDate;
import org.orekit.utils.PVCoordinates;
import org.springframework.stereotype.Service;
import personal.spacesim.services.interfaces.GenericPlanetaryOperations;
import personal.spacesim.services.interfaces.PlanetaryOperations;

@Service
public class GenericCelestialService implements GenericPlanetaryOperations {

    @Override
    public Vector3D getPosition(String planetName, Frame frame, AbsoluteDate date) {
        //TODO find out if there's a custom factory for celestial bodies
        CelestialBody planet = CelestialBodyFactory.getBody(planetName);
        PVCoordinates pv = planet.getPVCoordinates(date, frame);
        return pv.getPosition();
    }

    @Override
    public Vector3D getVelocity(String planetName, Frame frame, AbsoluteDate date) {
        CelestialBody planet = CelestialBodyFactory.getBody(planetName);
        PVCoordinates pv = planet.getPVCoordinates(date, frame);
        return pv.getVelocity();
    }
}
