package good.stuff.webstore.controller;

import good.stuff.webstore.common.enums.Payment.PaymentType;
import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.repository.user.UserRepository;
import good.stuff.webstore.service.OrderService;
import good.stuff.webstore.service.PaymentService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import good.stuff.webstore.common.model.order.Order;
import org.springframework.web.bind.annotation.PostMapping;

import java.security.Principal;
import java.util.List;

@Controller
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final PaymentService paymentService;

    public OrderController(OrderService orderService, UserRepository userRepository, PaymentService paymentService) {
        this.orderService = orderService;
        this.userRepository = userRepository;
        this.paymentService = paymentService;
    }

    @GetMapping("/order/success")
    public String orderSuccess() {
        return "cart/success";
    }

    @PostMapping("/order/process")
    public String processOrder(Principal principal) {
        if (principal == null) return "redirect:/login";

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderService.createOrderFromCart(user);
        if (order == null) {
            return "redirect:/cart/view";
        }

        paymentService.createPayment(order, PaymentType.CASH);

        return "redirect:/order/success";
    }
}

