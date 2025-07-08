package good.stuff.backend.common.model;

import good.stuff.backend.common.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_logs")
@NoArgsConstructor
@Getter
@Setter
public class EventLog extends BaseEntity {
    private String username;

    private String eventType;

    private String message;

    private String ipAddress;

    private LocalDateTime eventTime;

    public EventLog(String username, String eventType, String message, String ipAddress, LocalDateTime eventTime) {
        this.username = username;
        this.eventType = eventType;
        this.message = message;
        this.ipAddress = ipAddress;
        this.eventTime = eventTime;
    }
}
