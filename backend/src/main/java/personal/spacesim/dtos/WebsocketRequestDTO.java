package personal.spacesim.dtos;

public class WebsocketRequestDTO {

    private double totalTime;
    private double deltaTime;
    private String sessionID;

    // Getters and setters
    public double getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(double totalTime) {
        this.totalTime = totalTime;
    }

    public double getDeltaTime() {
        return deltaTime;
    }

    public void setDeltaTime(double deltaTime) {
        this.deltaTime = deltaTime;
    }

    public String getSessionID() {
        return sessionID;
    }

    public void setSessionId(String sessionID) {
        this.sessionID = sessionID;
    }
}