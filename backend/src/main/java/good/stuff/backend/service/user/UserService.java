package good.stuff.backend.service.user;

import good.stuff.backend.common.dto.user.UserDto;
import good.stuff.backend.common.enums.Role;
import good.stuff.backend.common.model.user.User;
import good.stuff.backend.common.request.LoginRequest;
import good.stuff.backend.common.request.RegisterRequest;
import good.stuff.backend.repository.user.UserRepository;
import good.stuff.backend.utils.MapperUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);

        return MapperUtils.map(userRepository.save(user), UserDto.class);
    }

    public String login(LoginRequest request) {
        return "Logged in successfully (token placeholder)";
    }

    public void deleteAccount(Long userId) {
        userRepository.deleteById(userId);
    }
}
