package good.stuff.webstore.controller.rest;

import good.stuff.webstore.common.model.CartItem;
import good.stuff.webstore.service.CartService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class RestCartController {

    private final CartService cartService;

    public RestCartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addToCart(@RequestParam Long productId,
                                                         @RequestParam String name,
                                                         @RequestParam(defaultValue = "1") int quantity,
                                                         HttpSession session) {
        CartItem item = new CartItem(productId, name, quantity);
        cartService.addItem(session, item);
        return ResponseEntity.ok(Collections.singletonMap("message", "Added to cart successfully"));
    }
}
