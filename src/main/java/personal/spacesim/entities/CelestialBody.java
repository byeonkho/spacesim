package personal.spacesim.entities;

import org.joml.Vector3d;

public abstract class CelestialBody {
    public static int numCelestialBodies;

    private int id;
    private String name;
    private double mass;
    private double radius;
    private Vector3d position;
    private Vector3d velocity;

    public CelestialBody(
            int id,
            String name,
            double mass,
            double radius,
            Vector3d position,
            Vector3d velocity
    ) {
        this.id = id;
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getMass() {
        return mass;
    }

    public double getRadius() {
        return radius;
    }

    public Vector3d getPosition() {
        return position;
    }

    public void setPosition(Vector3d position) {
        this.position = position;
    }

    public Vector3d getVelocity() {
        return velocity;
    }

    public void setVelocity(Vector3d velocity) {
        this.velocity = velocity;
    }
}
