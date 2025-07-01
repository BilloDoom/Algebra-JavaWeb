package good.stuff.webstore.controller;

import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.repository.user.UserRepository;
import good.stuff.webstore.service.OrderService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import good.stuff.webstore.common.model.order.Order;

import java.security.Principal;
import java.util.List;

@Controller
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @GetMapping("/order/success")
    public String orderSuccess() {
        return "cart/success";
    }

    @GetMapping("/profile")
    public String viewProfile(Model model, Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderService.getOrdersByUserId(user.getId());

        model.addAttribute("user", user);
        model.addAttribute("orders", orders);
        return "user/profile";
    }
}

