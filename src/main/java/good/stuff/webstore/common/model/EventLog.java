package good.stuff.webstore.common.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_logs")
@NoArgsConstructor
@Getter
@Setter
public class EventLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
