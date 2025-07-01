package good.stuff.webstore.service;

import good.stuff.webstore.common.model.EventLog;
import good.stuff.webstore.repository.EventLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EventLogService {

    private final EventLogRepository repository;

    public EventLogService(EventLogRepository repository) {
        this.repository = repository;
    }

    public void logEvent(String username, String eventType, String message, String ipAddress) {
        EventLog event = new EventLog(username, eventType, message, ipAddress, LocalDateTime.now());
        repository.save(event);
    }
}
