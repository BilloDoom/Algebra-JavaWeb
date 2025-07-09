package good.stuff.backend.controller.cart;

import good.stuff.backend.common.dto.cart.CartItemDto;
import good.stuff.backend.common.request.CartItemRequest;
import good.stuff.backend.common.request.MergeCartRequest;
import good.stuff.backend.service.CartService;
import good.stuff.backend.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCartItems(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        List<CartItemDto> cartItemsDto = cartService.getCartItemsDto(userId);
        return ResponseEntity.ok(cartItemsDto);
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addItem(@RequestBody CartItemRequest request,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        cartService.addOrUpdateItem(userId, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<Void> updateQuantity(@PathVariable Long cartItemId,
                                               @RequestBody int quantity) {
        cartService.updateQuantity(cartItemId, quantity);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long cartItemId) {
        cartService.removeItem(cartItemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/merge")
    public ResponseEntity<Void> mergeCart(@RequestBody MergeCartRequest request,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        cartService.mergeSessionCart(userId, request.getItems());
        return ResponseEntity.ok().build();
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
