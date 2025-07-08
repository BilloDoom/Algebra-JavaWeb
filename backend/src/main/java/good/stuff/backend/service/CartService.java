package good.stuff.backend.service;

import good.stuff.backend.common.model.cart.CartItem;
import good.stuff.backend.common.model.product.Product;
import good.stuff.backend.common.model.user.User;
import good.stuff.backend.repository.product.ProductRepository;
import good.stuff.backend.repository.cart.CartItemRepository;
import good.stuff.backend.repository.user.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // For logged-in users: get DB cart
    public List<CartItem> getCartByUser(Long userId) {
        return userRepository.findById(userId)
                .map(cartItemRepository::findByUser)
                .orElse(List.of());
    }

    // Add or update cart item for logged-in user
    public void addOrUpdateItem(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByUserAndProduct(user, product)
                .orElse(new CartItem());

        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(item.getQuantity() + quantity);
        cartItemRepository.save(item);
    }

    // Update quantity
    public void updateQuantity(Long cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }

    public void removeItem(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    public void clearCart(Long userId) {
        userRepository.findById(userId)
                .ifPresent(user -> {
                    List<CartItem> items = cartItemRepository.findByUser(user);
                    cartItemRepository.deleteAll(items);
                });
    }

    // Merge session cart items into DB cart after login
    public void mergeSessionCart(Long userId, List<CartItem> sessionCartItems) {
        for (CartItem sessionItem : sessionCartItems) {
            addOrUpdateItem(userId, sessionItem.getProduct().getId(), sessionItem.getQuantity());
        }
    }

    public List<CartItem> getCartItems(Long userId) {
        return getCartByUser(userId);
    }

    public BigDecimal calculateTotal(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

}

