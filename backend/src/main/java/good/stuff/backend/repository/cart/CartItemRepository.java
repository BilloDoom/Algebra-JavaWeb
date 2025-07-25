package good.stuff.backend.repository.cart;

import good.stuff.backend.common.model.cart.CartItem;
import good.stuff.backend.common.model.product.Product;
import good.stuff.backend.common.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
}
