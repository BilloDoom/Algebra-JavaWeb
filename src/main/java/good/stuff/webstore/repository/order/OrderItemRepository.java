package good.stuff.webstore.repository.order;

import good.stuff.webstore.common.model.order.OrderItem;
import good.stuff.webstore.common.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
