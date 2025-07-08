package good.stuff.backend.repository.user;

import good.stuff.backend.common.model.user.User;
import good.stuff.backend.common.model.user.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    List<UserAddress> findByUser(User user);
    Optional<UserAddress> findByIdAndUser(Long id, User user);
    Optional<UserAddress> findFirstByUserOrderByIdAsc(User user);
}
