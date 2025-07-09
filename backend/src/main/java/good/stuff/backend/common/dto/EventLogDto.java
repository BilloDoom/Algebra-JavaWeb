package good.stuff.backend.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventLogDto {
    private Long id;
    private String username;
    private String eventType;
    private String message;
    private String ipAddress;
    private LocalDateTime eventTime;
}
