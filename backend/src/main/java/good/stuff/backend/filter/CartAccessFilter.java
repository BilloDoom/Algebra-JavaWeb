package good.stuff.backend.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@Order(1)
public class CartAccessFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String uri = req.getRequestURI();

        if (uri.startsWith("/cart")) {
            long start = System.currentTimeMillis();

            String method = req.getMethod();
            String ip = req.getRemoteAddr();

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String user = (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser"))
                    ? auth.getName()
                    : "guest";

            System.out.println("\n");
            System.out.println("Time: " + LocalDateTime.now());
            System.out.println("User: " + user);
            System.out.println("IP: " + ip);
            System.out.println("Method: " + method);
            System.out.println("Where: " + uri);
            System.out.println("Status before: " + res.getStatus());

            chain.doFilter(request, response);

            long duration = System.currentTimeMillis() - start;
            System.out.println("Status after: " + res.getStatus());
            System.out.println("Time: " + duration + "ms");
            System.out.println("\n");
        } else {
            chain.doFilter(request, response);
        }
    }
}
