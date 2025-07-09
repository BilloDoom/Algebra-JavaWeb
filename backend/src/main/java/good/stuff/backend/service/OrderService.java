package good.stuff.backend.service;

import good.stuff.backend.common.dto.order.OrderDTO;
import good.stuff.backend.common.enums.OrderStatus;
import good.stuff.backend.common.enums.Payment.PaymentStatus;
import good.stuff.backend.common.enums.Payment.PaymentType;
import good.stuff.backend.common.model.cart.CartItem;
import good.stuff.backend.common.model.order.Order;
import good.stuff.backend.common.model.order.OrderItem;
import good.stuff.backend.common.model.order.Payment;
import good.stuff.backend.common.model.product.Product;
import good.stuff.backend.common.model.user.User;
import good.stuff.backend.repository.PaymentRepository;
import good.stuff.backend.repository.cart.CartItemRepository;
import good.stuff.backend.repository.order.OrderRepository;
import good.stuff.backend.repository.product.ProductRepository;
import good.stuff.backend.repository.user.UserRepository;
import good.stuff.backend.utils.MapperUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    @Transactional
    public OrderDTO createOrder(Long userId, String shippingAddress, PaymentType paymentType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        // Calculate totalAmount separately
        BigDecimal totalAmount = cartItems.stream()
                .map(ci -> ci.getProduct().getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create OrderItems from CartItems
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> OrderItem.builder()
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .unitPrice(cartItem.getProduct().getPrice())
                        .build())
                .collect(Collectors.toList());

        // Build and save Order
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PROCESSING)
                .totalAmount(totalAmount)
                .shippingAddress(shippingAddress)
                .build();

        order = orderRepository.save(order);

        // Link order to orderItems and set them
        Order finalOrder = order;
        orderItems.forEach(item -> item.setOrder(finalOrder));
        order.setItems(orderItems);

        order = orderRepository.save(order); // Save again with items

        // Create and save Payment linked to order
        Payment payment = Payment.builder()
                .order(order)
                .method(paymentType)
                .status(PaymentStatus.PENDING)
                .build();
        paymentRepository.save(payment);

        // Clear user's cart after order creation
        cartItemRepository.deleteAll(cartItems);

        // Map and return DTO
        return MapperUtils.map(order, OrderDTO.class);
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(order -> MapperUtils.map(order, OrderDTO.class))
                .collect(Collectors.toList());
    }
}
