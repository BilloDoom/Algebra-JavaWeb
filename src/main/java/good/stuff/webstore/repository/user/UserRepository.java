package good.stuff.webstore.repository.user;

import good.stuff.webstore.common.enums.Role;
import good.stuff.webstore.common.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);
    boolean existsByRole(Role role);
    long countByRole(Role role);
}
