package good.stuff.backend.listener;

import good.stuff.backend.service.EventLogService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class LoginSuccessListener implements ApplicationListener<AuthenticationSuccessEvent> {

    private final EventLogService eventLogService;
    private final HttpServletRequest request;

    public LoginSuccessListener(EventLogService eventLogService, HttpServletRequest request) {
        this.eventLogService = eventLogService;
        this.request = request;
    }

    @Override
    public void onApplicationEvent(AuthenticationSuccessEvent event) {
        Authentication auth = event.getAuthentication();
        String username = auth.getName();
        String ip = getClientIp();

        eventLogService.logEvent(username, "LOGIN", "User logged in successfully", ip);
    }

    private String getClientIp() {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
