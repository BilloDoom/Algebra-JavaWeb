package good.stuff.webstore.repository;

import good.stuff.webstore.common.model.CartItem;
import good.stuff.webstore.common.model.Product;
import good.stuff.webstore.common.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
}
