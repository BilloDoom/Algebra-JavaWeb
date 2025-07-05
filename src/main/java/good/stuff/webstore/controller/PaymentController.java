package good.stuff.webstore.controller;

import good.stuff.webstore.common.enums.Payment.PaymentType;
import good.stuff.webstore.common.enums.Payment.PaymentStatus;
import good.stuff.webstore.common.model.order.Order;
import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.repository.user.UserRepository;
import good.stuff.webstore.service.OrderService;
import good.stuff.webstore.service.PaymentService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Controller
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;
    private final UserRepository userRepository;

    public PaymentController(PaymentService paymentService, OrderService orderService, UserRepository userRepository) {
        this.paymentService = paymentService;
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @GetMapping("/choose")
    public String choosePaymentMethod(Model model, Principal principal) {
        if (principal == null) return "redirect:/login";

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order lastOrder = orderService.getLastOrderForUser(user);
        if (lastOrder == null) {
            model.addAttribute("error", "No order found to pay for.");
            return "error";
        }

        model.addAttribute("order", lastOrder);
        model.addAttribute("paymentTypes", PaymentType.values());
        return "payment/choose";
    }

    @PostMapping("/paypal/{orderId}")
    public String createPaypalPayment(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return "redirect:/error";
        }

        paymentService.createPaymentWithStatus(order, PaymentType.PAYPAL, PaymentStatus.COMPLETED);
        return "redirect:/order/success";
    }

    @PostMapping("/cash/{orderId}")
    public String createCashPayment(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return "redirect:/error";
        }

        paymentService.createPaymentWithStatus(order, PaymentType.CASH, PaymentStatus.PENDING);
        return "redirect:/order/success";
    }
}
