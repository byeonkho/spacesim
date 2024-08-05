package personal.spacesim.dtos;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.orekit.time.AbsoluteDate;
import personal.spacesim.utils.serializers.AbsoluteDateSerializer;

import java.util.Objects;

public class WebSocketMetaData {


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
        WebSocketMetaData that = (WebSocketMetaData) o;
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