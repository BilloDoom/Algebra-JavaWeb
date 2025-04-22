package good.stuff.webstore.config;

import good.stuff.webstore.common.enums.Role;
import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.repository.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

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

                userRepository.save(admin);
                log.info("Default admin account created (username: admin, password: admin)");
            } else {
                log.info("Admin already exists, no default admin created.");
            }
        };
    }
}
