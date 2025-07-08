package good.stuff.backend.repository.user;

import good.stuff.backend.common.enums.Role;
import good.stuff.backend.common.model.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String username);
    boolean existsByRole(Role role);
    @Transactional
    void deleteByUsername(String username);
}
