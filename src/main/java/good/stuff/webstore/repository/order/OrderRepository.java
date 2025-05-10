package good.stuff.webstore.repository.order;

import good.stuff.webstore.common.model.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
