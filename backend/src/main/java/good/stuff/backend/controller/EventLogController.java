package good.stuff.backend.controller;

import good.stuff.backend.common.dto.EventLogDto;
import good.stuff.backend.common.model.EventLog;
import good.stuff.backend.service.EventLogService;
import good.stuff.backend.utils.MapperUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/logs")
@RequiredArgsConstructor
public class EventLogController {

    private final EventLogService eventLogService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<EventLogDto>> getAllLogs() {
        List<EventLog> logs = eventLogService.getEvents();
        List<EventLogDto> logsDto = logs.stream()
                .map(log -> MapperUtils.map(log, EventLogDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(logsDto);
    }
}
