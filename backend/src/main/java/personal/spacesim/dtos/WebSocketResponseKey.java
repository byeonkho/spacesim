package personal.spacesim.dtos;

import org.orekit.time.AbsoluteDate;

import java.util.Objects;

public class WebSocketResponseKey {


    private AbsoluteDate date;

    public AbsoluteDate getDate() {
        return date;
    }

    public void setDate(AbsoluteDate date) {
        this.date = date;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WebSocketResponseKey that = (WebSocketResponseKey) o;
        return Objects.equals(
                date,
                that.date
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(date);
    }
}