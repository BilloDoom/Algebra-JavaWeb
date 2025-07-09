package good.stuff.backend.controller.user;

import good.stuff.backend.common.dto.user.UserDto;
import good.stuff.backend.common.request.LoginRequest;
import good.stuff.backend.common.request.RegisterRequest;
import good.stuff.backend.common.response.JwtResponse;
import good.stuff.backend.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        if (authentication != null) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
        }
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long userId) {
        userService.deleteAccount(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserDto> getProfile(@PathVariable Long userId) {
        UserDto userDto = userService.getUserProfile(userId);
        return ResponseEntity.ok(userDto);
    }
}
