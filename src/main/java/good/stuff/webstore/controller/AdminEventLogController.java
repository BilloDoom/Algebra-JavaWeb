package good.stuff.webstore.controller;

import good.stuff.webstore.common.model.EventLog;
import good.stuff.webstore.repository.EventLogRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@PreAuthorize("hasRole('ADMIN')")
public class AdminEventLogController {

    private final EventLogRepository eventLogRepository;

    public AdminEventLogController(EventLogRepository eventLogRepository) {
        this.eventLogRepository = eventLogRepository;
    }

    @GetMapping("/admin/logs")
    public String viewLogs(
            Model model,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        List<EventLog> logs;

        if (username == null && eventType == null && startDate == null && endDate == null) {
            // No filter — get all logs
            logs = eventLogRepository.findAll();
        } else {
            // Filter logs by criteria — you need to implement this query in repository
            logs = eventLogRepository.findFilteredLogs(username, eventType, startDate, endDate);
        }

        model.addAttribute("logs", logs);
        model.addAttribute("username", username);
        model.addAttribute("eventType", eventType);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        return "admin/logs-view";
    }
}
