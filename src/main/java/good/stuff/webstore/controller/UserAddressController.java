package good.stuff.webstore.controller;

import good.stuff.webstore.common.model.user.User;
import good.stuff.webstore.common.model.user.UserAddress;
import good.stuff.webstore.service.user.UserAddressService;
import good.stuff.webstore.service.user.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user/addresses")
public class UserAddressController {

    private final UserService userService;
    private final UserAddressService addressService;

    public UserAddressController(UserService userService, UserAddressService addressService) {
        this.userService = userService;
        this.addressService = addressService;
    }

    @GetMapping
    public String showProfileWithAddresses(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        User user = userService.findByUsername(userDetails.getUsername());
        model.addAttribute("user", user);
        model.addAttribute("orders", user.getOrders());
        model.addAttribute("addresses", addressService.getAddressesByUser(user));
        model.addAttribute("newAddress", new UserAddress());
        return "user/profile";
    }

    @PostMapping
    public String addAddress(@AuthenticationPrincipal UserDetails userDetails,
                             @ModelAttribute("newAddress") @Valid UserAddress newAddress,
                             BindingResult result,
                             Model model) {
        User user = userService.findByUsername(userDetails.getUsername());

        if (result.hasErrors()) {
            model.addAttribute("user", user);
            model.addAttribute("orders", user.getOrders());
            model.addAttribute("addresses", addressService.getAddressesByUser(user));
            return "user/profile";
        }

        try {
            addressService.addAddress(user, newAddress);
        } catch (IllegalStateException e) {
            result.rejectValue(null, "error.newAddress", e.getMessage());
            model.addAttribute("user", user);
            model.addAttribute("orders", user.getOrders());
            model.addAttribute("addresses", addressService.getAddressesByUser(user));
            return "user/profile";
        }

        return "redirect:/user/addresses";
    }

    @PostMapping("/edit/{id}")
    public String editAddress(@AuthenticationPrincipal UserDetails userDetails,
                              @PathVariable Long id,
                              @ModelAttribute("editedAddress") @Valid UserAddress editedAddress,
                              BindingResult result,
                              Model model) {
        User user = userService.findByUsername(userDetails.getUsername());

        if (result.hasErrors()) {
            model.addAttribute("user", user);
            model.addAttribute("orders", user.getOrders());
            model.addAttribute("addresses", addressService.getAddressesByUser(user));
            return "user/profile";
        }

        addressService.updateAddress(user, id, editedAddress);
        return "redirect:/user/addresses";
    }

    @PostMapping("/delete/{id}")
    public String deleteAddress(@AuthenticationPrincipal UserDetails userDetails,
                                @PathVariable Long id) {
        User user = userService.findByUsername(userDetails.getUsername());
        addressService.deleteAddress(user, id);
        return "redirect:/user/addresses";
    }
}
