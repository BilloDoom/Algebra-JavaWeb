package good.stuff.webstore.controller.error;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.stream.Collectors;

@Controller
public class ErrorController {
    @GetMapping("/403")
    public String handleAccessDenied(Model model, Authentication authentication) {
        if (authentication != null) {
            String username = authentication.getName();
            String roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(", "));

            model.addAttribute("username", username);
            model.addAttribute("roles", roles);
        } else {
            model.addAttribute("username", "Anonymous");
            model.addAttribute("roles", "None");
        }

        return "error/403";
    }
}
