package good.stuff.webstore.controller;

import good.stuff.webstore.common.model.CartItem;
import good.stuff.webstore.service.CartService;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @ModelAttribute("cart")
    public List<CartItem> populateCart(HttpSession session) {
        return cartService.getCart(session);
    }

    @GetMapping
    public String showCart(Model model, HttpSession session) {
        model.addAttribute("cart", cartService.getCart(session));
        return "cart/cart-view";  // Thymeleaf view rendering
    }

    @PostMapping("/remove")
    public String removeFromCart(@RequestParam Long productId, HttpSession session) {
        cartService.removeItem(session, productId);
        return "redirect:/cart";
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/checkout")
    public String checkout(Model model, HttpSession session) {
        List<CartItem> cart = cartService.getCart(session);
        if (cart.isEmpty()) {
            model.addAttribute("error", "Your cart is empty.");
            return "cart/cart-view";
        }
        // Checkout logic here...
        return "cart/checkout";
    }
}
