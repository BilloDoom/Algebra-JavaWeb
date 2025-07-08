package good.stuff.backend.config;

import good.stuff.backend.common.enums.Role;
import good.stuff.backend.common.model.user.User;
import good.stuff.backend.repository.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.LocalDateTime;

@Slf4j
@Configuration
public class DataSeeder {
    @Bean
    public CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            boolean adminExists = userRepository.existsByRole(Role.ADMIN);

            if (!adminExists) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@webstore.com");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setRole(Role.ADMIN);
                admin.setCreatedAt(Instant.now());
                admin.setUpdatedAt(Instant.now());

                userRepository.save(admin);
                log.info("Default admin account created (username: admin, password: admin)");
            } else {
                log.info("Admin already exists, no default admin created.");
            }
        };
    }
}
