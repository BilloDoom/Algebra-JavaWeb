package good.stuff.webstore.controller;

import good.stuff.webstore.common.model.order.Order;
import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.common.model.user.UserAddress;
import good.stuff.webstore.service.OrderService;
import good.stuff.webstore.service.user.UserAddressService;
import good.stuff.webstore.service.user.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
public class UserController {

    private final UserService userService;
    private final OrderService orderService;
    private final UserAddressService addressService;

    public UserController(UserService userService, OrderService orderService, UserAddressService addressService) {
        this.userService = userService;
        this.orderService = orderService;
        this.addressService = addressService;
    }

    @PostMapping("/user/delete")
    public String deleteUserAccount(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        userService.deleteUserByUsername(username);
        return "redirect:/logout";
    }

    @GetMapping("/user/profile")
    public String userProfile(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        String username = userDetails.getUsername();
        User user = userService.findByUsername(username);
        model.addAttribute("user", user);

        List<Order> orders = orderService.getOrdersByUserId(user.getId());
        model.addAttribute("orders", orders);

        List<UserAddress> addresses = addressService.getAddressesByUser(user);
        model.addAttribute("addresses", addresses);

        return "user/profile";
    }

}
