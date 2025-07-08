package good.stuff.backend.repository.order;

import good.stuff.backend.common.model.order.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
