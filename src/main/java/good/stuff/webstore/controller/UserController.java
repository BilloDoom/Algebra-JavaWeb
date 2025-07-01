package good.stuff.webstore.controller;

import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.service.user.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class UserController {

    private final UserService userService; // your service to handle user operations

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user/profile")
    public String userProfile(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        String username = userDetails.getUsername();
        User user = userService.findByUsername(username);  // Fetch user entity by username
        model.addAttribute("user", user);
        return "user/profile";  // profile.html Thymeleaf template
    }

    @PostMapping("/user/delete")
    public String deleteUserAccount(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        userService.deleteUserByUsername(username);
        return "redirect:/logout";  // Logout after deletion
    }
}
