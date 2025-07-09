package good.stuff.backend.controller.order;

import good.stuff.backend.common.dto.order.OrderDTO;
import good.stuff.backend.common.enums.Payment.PaymentType;
import good.stuff.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(
            @RequestParam Long userId,
            @RequestParam String shippingAddress,
            @RequestParam PaymentType paymentType) {
        OrderDTO order = orderService.createOrder(userId, shippingAddress, paymentType);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersForUser(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
}
