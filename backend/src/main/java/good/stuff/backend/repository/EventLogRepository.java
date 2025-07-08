package good.stuff.backend.repository;

import good.stuff.backend.common.model.EventLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventLogRepository extends JpaRepository<EventLog, Long> {
    @Query("""
        SELECT e FROM EventLog e
        WHERE (:username IS NULL OR e.username LIKE %:username%)
          AND (:eventType IS NULL OR e.eventType = :eventType)
          AND (:startDate IS NULL OR e.eventTime >= :startDate)
          AND (:endDate IS NULL OR e.eventTime <= :endDate)
        ORDER BY e.eventTime DESC
        """)
    List<EventLog> findFilteredLogs(
            @Param("username") String username,
            @Param("eventType") String eventType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
