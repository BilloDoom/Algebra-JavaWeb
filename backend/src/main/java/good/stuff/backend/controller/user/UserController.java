package good.stuff.backend.controller.user;

import good.stuff.backend.common.dto.user.UserDto;
import good.stuff.backend.common.request.LoginRequest;
import good.stuff.backend.common.request.RegisterRequest;
import good.stuff.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long userId) {
        userService.deleteAccount(userId);
        return ResponseEntity.noContent().build();
    }
}
