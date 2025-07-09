package good.stuff.backend.handler;

import good.stuff.backend.service.EventLogService;
import good.stuff.backend.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Component
public class CustomLogoutHandler implements LogoutHandler {

    private final EventLogService eventLogService;
    private final HttpServletRequest request;
    private final JwtUtil jwtUtil;

    public CustomLogoutHandler(EventLogService eventLogService, HttpServletRequest request, JwtUtil jwtUtil) {
        this.eventLogService = eventLogService;
        this.request = request;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        if (authentication == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = jwtUtil.extractUsername(token);
                String ip = getClientIp();
                eventLogService.logEvent(username, "LOGOUT", "User logged out", ip);
                return;
            }
        }

        if (authentication != null) {
            String username = authentication.getName();
            String ip = getClientIp();
            eventLogService.logEvent(username, "LOGOUT", "User logged out", ip);
        }
    }


    private String getClientIp() {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
