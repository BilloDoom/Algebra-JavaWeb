package good.stuff.webstore.service.user;

import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.config.security.CustomUserDetails;
import good.stuff.webstore.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        try {
            var asd = userRepository.findByUsername("admin");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        int a = 1;

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));



        return new CustomUserDetails(user);
    }
}
