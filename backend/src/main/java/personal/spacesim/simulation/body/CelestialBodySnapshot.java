package personal.spacesim.simulation.body;

import org.hipparchus.geometry.euclidean.threed.Vector3D;

public class CelestialBodySnapshot {
    private String name;

    private Vector3D position;
    private Vector3D velocity;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Vector3D getPosition() {
        return position;
    }

    public void setPosition(Vector3D position) {
        this.position = position;
    }

    public Vector3D getVelocity() {
        return velocity;
    }

    public void setVelocity(Vector3D velocity) {
        this.velocity = velocity;
    }


}
