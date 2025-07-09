package good.stuff.backend.service.user;

import good.stuff.backend.common.dto.user.UserDto;
import good.stuff.backend.common.enums.Role;
import good.stuff.backend.common.model.user.User;
import good.stuff.backend.common.request.LoginRequest;
import good.stuff.backend.common.request.RegisterRequest;
import good.stuff.backend.common.response.JwtResponse;
import good.stuff.backend.config.security.CustomUserDetails;
import good.stuff.backend.repository.user.UserRepository;
import good.stuff.backend.utils.JwtUtil;
import good.stuff.backend.utils.MapperUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

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

    public JwtResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String jwt = jwtUtil.generateToken(userDetails);

        String username = userDetails.getUsername();
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return new JwtResponse(jwt, user.get().getId());
        }else{
            throw new IllegalArgumentException("Invalid username or password");
        }
    }

    public void deleteAccount(Long userId) {
        userRepository.deleteById(userId);
    }

    public UserDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        return MapperUtils.map(user, UserDto.class);
    }
}
