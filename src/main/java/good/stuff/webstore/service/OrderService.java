package good.stuff.webstore.service;

import good.stuff.webstore.common.enums.OrderStatus;
import good.stuff.webstore.common.model.CartItem;
import good.stuff.webstore.common.model.order.Order;
import good.stuff.webstore.common.model.order.OrderItem;
import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.common.model.user.UserAddress;
import good.stuff.webstore.repository.CartItemRepository;
import good.stuff.webstore.repository.order.OrderRepository;
import good.stuff.webstore.repository.user.UserAddressRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartRepository;
    private final UserAddressRepository addressRepository;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartRepository, UserAddressRepository addressRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }


    @Transactional
    public Order createOrderFromCart(User user) {
        List<CartItem> cartItems = cartRepository.findByUser(user);

        if (cartItems.isEmpty()) return null;

        UserAddress defaultAddress = addressRepository.findFirstByUserOrderByIdAsc(user)
                .orElseThrow(() -> new RuntimeException("No address found for user"));

        List<OrderItem> orderItems = cartItems.stream()
                .map(item -> OrderItem.builder()
                        .product(item.getProduct())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getProduct().getPrice())
                        .build())
                .toList();

        BigDecimal total = orderItems.stream()
                .map(oi -> oi.getUnitPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(user)
                .items(orderItems)
                .status(OrderStatus.SHIPPED)
                .totalAmount(total)
                .shippingAddress(defaultAddress.formatAddress())
                .build();

        orderItems.forEach(oi -> oi.setOrder(order));

        orderRepository.save(order);
        cartRepository.deleteAll(cartItems);

        return order;
    }


    public Order getLastOrderForUser(User user) {
        List<Order> orders = getOrdersByUserId(user.getId());
        if (orders.isEmpty()) return null;
        return orders.get(orders.size() - 1);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }
}
